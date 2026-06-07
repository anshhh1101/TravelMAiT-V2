import os
import json
import re
import requests
from groq import Groq
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.utils.embedder      import embed
from app.utils.chroma_client import query_places

itinerary_bp = Blueprint('itinerary', __name__)
client       = Groq(api_key=os.getenv("GROQ_API_KEY"))
FSQ_KEY      = os.getenv("FOURSQUARE_API_KEY")
MODEL        = "llama-3.3-70b-versatile"

# ── District → coordinates map (from odisha_100_locations.json) ──────────────
DISTRICT_COORDS = {
    "puri":        (19.8876, 86.0945),
    "khurda":      (20.2390, 85.8336),
    "cuttack":     (20.5833, 85.5833),
    "bhubaneswar": (20.2961, 85.8245),
    "sambalpur":   (21.4669, 83.9812),
    "koraput":     (18.7500, 82.8333),
    "ganjam":      (19.2608, 84.9069),
    "mayurbhanj":  (21.8333, 86.3500),
    "kendrapara":  (20.7500, 86.8833),
    "angul":       (20.6833, 84.7333),
    "kandhamal":   (20.0833, 84.1167),
    "dhenkanal":   (20.8167, 85.5000),
    "jajpur":      (20.8167, 86.5000),
    "balasore":    (21.4942, 86.9333),
    "konark":      (19.8876, 86.0945),
    "chilika":     (19.7167, 85.3167),
    "barkul":      (19.7167, 85.3167),
}

def get_coords(destination: str):
    """Return (lat, lng) for a destination string."""
    dest_lower = destination.lower().strip()
    for key, coords in DISTRICT_COORDS.items():
        if key in dest_lower:
            return coords
    # Default to Bhubaneswar if not found
    return (20.2961, 85.8245)


# ── Foursquare API helpers ────────────────────────────────────────────────────

FSQ_HEADERS = {
    "Authorization": FSQ_KEY or "",
    "accept": "application/json"
}

def fetch_foursquare(lat: float, lng: float, category: str, budget: str, limit: int = 4) -> list:
    """
    Fetch places from Foursquare Places API.
    category: 'hotels' or 'restaurants'
    """
    # Foursquare category IDs
    # 19014 = Hotels, 13065 = Restaurant
    cat_id = "19014" if category == "hotels" else "13065"

    # Price mapping: budget=1, mid=2, luxury=3,4
    price_map = {"budget": "1", "mid": "2", "luxury": "3,4"}
    price     = price_map.get(budget, "1,2")

    url = "https://api.foursquare.com/v3/places/search"
    params = {
        "ll":         f"{lat},{lng}",
        "radius":     5000,
        "categories": cat_id,
        "limit":      limit,
        "sort":       "RATING",
    }

    try:
        res = requests.get(url, headers=FSQ_HEADERS, params=params, timeout=8)
        data = res.json()
        results = []

        for place in data.get("results", []):
            name     = place.get("name", "")
            location = place.get("location", {})
            address  = location.get("formatted_address", location.get("address", ""))
            distance = place.get("distance", 0)
            rating   = place.get("rating", None)

            if name:
                results.append({
                    "name":     name,
                    "address":  address,
                    "distance": f"{distance}m away" if distance else "",
                    "rating":   f"{rating}/10" if rating else "",
                })

        return results

    except Exception as e:
        print(f"Foursquare error ({category}): {e}")
        return []


def format_foursquare_context(hotels: list, restaurants: list) -> str:
    """Format Foursquare results as context for Groq."""
    context = ""

    if hotels:
        context += "\nNEARBY HOTELS (from Foursquare):\n"
        for i, h in enumerate(hotels, 1):
            context += f"  {i}. {h['name']}"
            if h['address']:  context += f" — {h['address']}"
            if h['rating']:   context += f" (rated {h['rating']})"
            if h['distance']: context += f" [{h['distance']}]"
            context += "\n"

    if restaurants:
        context += "\nNEARBY RESTAURANTS (from Foursquare):\n"
        for i, r in enumerate(restaurants, 1):
            context += f"  {i}. {r['name']}"
            if r['address']:  context += f" — {r['address']}"
            if r['rating']:   context += f" (rated {r['rating']})"
            if r['distance']: context += f" [{r['distance']}]"
            context += "\n"

    return context


# ── Groq prompt ───────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are TRAVELMAiT AI, an expert Odisha travel planner.

Given the user's trip details, a list of sightseeing places, nearby hotels and restaurants, generate a detailed day-by-day itinerary.

RESPONSE FORMAT — output ONLY raw JSON, nothing else:

{
  "title": "2 Days in Puri — Beach & Temples",
  "summary": "A perfect family trip combining spirituality and coastal relaxation.",
  "days": [
    {
      "day": 1,
      "title": "Spiritual Morning, Golden Evening",
      "location": "Puri",
      "activities": [
        {
          "time": "7:00 AM",
          "title": "Jagannath Temple",
          "desc": "Start your day at one of India's holiest shrines. Arrive early to avoid crowds.",
          "isHiddenGem": false
        },
        {
          "time": "9:30 AM",
          "title": "Breakfast at Wildgrass Restaurant",
          "desc": "Authentic Odia cuisine — try the dalma and pakhala bhata. Located on VIP Road.",
          "isHiddenGem": false
        },
        {
          "time": "2:00 PM",
          "title": "Check-in: Hotel Mayfair Waves",
          "desc": "Beachfront luxury resort with sea-facing rooms. Rated 8.2/10 on Foursquare.",
          "isHiddenGem": false
        },
        {
          "time": "6:00 PM",
          "title": "Chandrabhaga Beach at Sunset",
          "desc": "3km from Konark — completely empty, far more peaceful than Puri beach.",
          "isHiddenGem": true
        },
        {
          "time": "8:00 PM",
          "title": "Dinner at Peace Restaurant",
          "desc": "Popular seafood spot near Marine Drive. Try the prawn malai curry.",
          "isHiddenGem": false
        }
      ]
    }
  ]
}

RULES:
- Use ONLY places from SIGHTSEEING CONTEXT for tourist activities
- Use hotels from NEARBY HOTELS section for accommodation activities
- Use restaurants from NEARBY RESTAURANTS section for meal activities  
- Include breakfast, lunch, dinner and hotel check-in naturally in the schedule
- Mark hidden/offbeat places with isHiddenGem: true
- Space activities realistically — include travel time between places
- Output ONLY raw JSON. No markdown. No explanation. Start with { end with }."""


def build_prompt(form: dict, places: list, hotels: list, restaurants: list) -> str:
    # Sightseeing context
    sightseeing = ""
    for p in places:
        sightseeing += (
            f"- {p['name']} ({p['type']}) | {p['region']} | "
            f"mood: {', '.join(p['mood_tags'][:3])} | "
            f"entry: ₹{p['entry_fee_inr']} | {p['description'][:120]}...\n"
        )

    budget_map = {
        'budget': 'Under ₹5,000/day per person',
        'mid':    '₹5,000–₹15,000/day per person',
        'luxury': 'Above ₹15,000/day per person',
    }

    fsq_context = format_foursquare_context(hotels, restaurants)

    return (
        f"TRIP DETAILS:\n"
        f"Destination: {form['destination']}\n"
        f"Duration: {form['duration']} days\n"
        f"Vibe: {form['mood']}\n"
        f"Budget: {budget_map.get(form['budget'], form['budget'])}\n"
        f"Group: {form['groupType']}\n\n"
        f"SIGHTSEEING CONTEXT:\n{sightseeing}\n"
        f"{fsq_context}\n"
        f"Generate a detailed {form['duration']}-day itinerary. "
        f"Include meals and hotel check-in using the Foursquare data above. "
        f"Respond with raw JSON only."
    )


def extract_json(raw: str) -> dict:
    raw = raw.strip()
    raw = re.sub(r'^```(?:json)?\s*', '', raw, flags=re.MULTILINE)
    raw = re.sub(r'\s*```$',          '', raw, flags=re.MULTILINE)
    raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    start = raw.find('{')
    end   = raw.rfind('}') + 1
    if start != -1 and end > start:
        try:
            return json.loads(raw[start:end])
        except json.JSONDecodeError:
            pass

    return {}


# ── Route ─────────────────────────────────────────────────────────────────────

@itinerary_bp.route('/itinerary', methods=['POST'])
@jwt_required()
def generate_itinerary():
    form = request.get_json()

    required = ['destination', 'mood', 'duration', 'budget', 'groupType']
    if not all(k in form for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    # Step 1 — ChromaDB: get relevant sightseeing places
    query     = f"{form['destination']} {form['mood']} {form['budget']}"
    query_vec = embed(query)
    places    = query_places(query_vec, n_results=15)

    # Step 2 — Foursquare: get real hotels and restaurants
    lat, lng    = get_coords(form['destination'])
    hotels      = fetch_foursquare(lat, lng, "hotels",      form['budget'], limit=4)
    restaurants = fetch_foursquare(lat, lng, "restaurants", form['budget'], limit=6)

    # Step 3 — Groq: generate full itinerary
    prompt = build_prompt(form, places, hotels, restaurants)

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": prompt}
            ],
            temperature=0.5,
            max_tokens=4096,
        )

        raw    = response.choices[0].message.content
        result = extract_json(raw)

        if not result or 'days' not in result:
            return jsonify({"error": "Failed to generate itinerary"}), 500

        # Attach raw Foursquare data so frontend can display if needed
        result["hotels"]      = hotels
        result["restaurants"] = restaurants

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500