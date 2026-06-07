import os
import json
import re
from groq import Groq
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.utils.embedder      import embed
from app.utils.chroma_client import query_places

chat_bp = Blueprint('chat', __name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL  = "llama-3.3-70b-versatile"


SYSTEM_PROMPT = """You are TRAVELMAiT AI, a warm travel guide for Odisha, India.

Given a list of places from the database and the user's query, decide which places to recommend.

RESPONSE FORMAT — output ONLY raw JSON, nothing else:

For place recommendations:
{"type":"itinerary","intro":"warm 1-2 sentence intro","recommended_ids":["odisha_001","odisha_003"]}

For general chat (greetings, questions, non-place queries):
{"type":"text","reply":"your reply"}

RULES:
- recommended_ids must only contain IDs from the CONTEXT provided
- Pick the most relevant 2-5 places based on the user's query
- Output ONLY the JSON. No markdown. No explanation. Start with { end with }."""


def build_messages(user_message: str, places: list, history: list) -> list:
    # Compact context — just enough for Groq to pick the right places
    context = ""
    for p in places:
        context += (
            f"ID:{p['id']} | {p['name']} | {p['type']} | "
            f"mood:{','.join(p['mood_tags'][:3])} | "
            f"fee:₹{p['entry_fee_inr']}\n"
        )

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in history[-6:]:
        messages.append({
            "role":    msg["role"] if msg["role"] in ["user", "assistant"] else "user",
            "content": msg["content"]
        })

    messages.append({
        "role": "user",
        "content": f"CONTEXT:\n{context}\n\nUser: {user_message}\n\nRespond with raw JSON only."
    })

    return messages


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

    return {"type": "text", "reply": raw}


def get_places_by_ids(ids: list, all_places: list) -> list:
    """Look up full place details from the retrieved places using IDs."""
    place_map = {p['id']: p for p in all_places}
    return [place_map[pid] for pid in ids if pid in place_map]


@chat_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    data    = request.get_json()
    message = data.get('message', '').strip()
    history = data.get('history', [])

    if not message:
        return jsonify({"error": "Message is required"}), 400

    # Step 1 — get relevant places from ChromaDB
    query_vec = embed(message)
    places    = query_places(query_vec, n_results=10)

    # Step 2 — ask Groq to pick the best ones (compact prompt)
    messages = build_messages(message, places, history)

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.4,
            max_tokens=256,   # small — Groq only returns IDs now
        )

        raw    = response.choices[0].message.content
        result = extract_json(raw)

        # Step 3 — if itinerary, enrich with full place data from ChromaDB results
        if result.get("type") == "itinerary" and "recommended_ids" in result:
            full_places = get_places_by_ids(result["recommended_ids"], places)
            return jsonify({
                "type":   "itinerary",
                "intro":  result.get("intro", "Here are some places for you!"),
                "places": full_places
            }), 200

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "type":  "text",
            "reply": f"Sorry, I ran into an issue: {str(e)}"
        }), 200