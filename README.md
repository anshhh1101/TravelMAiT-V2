# TRAVELMAiT V2 🌏

> **AI-powered travel planner for Odisha** — mood-based itinerary generation, RAG pipeline, Groq LLM narration, and Foursquare-powered hotel & restaurant recommendations.

🏆 **Top 50 — Smart India Hackathon 2025**

🔗 **Live Demo:** [travelmait-v2.vercel.app](https://travelmait-v2.vercel.app)

---

## What is TRAVELMAiT?

TRAVELMAiT is an AI travel planning assistant built specifically for **offbeat and less-explored destinations in Odisha**. Users describe their travel mood, duration, budget, and group type — and the system generates a detailed, day-by-day itinerary with real hotel and restaurant recommendations, powered by Groq's LLaMA 3.3 70B model.

---

## Features

- **Mood-based itinerary generation** — adventurous, spiritual, romantic, family, offbeat
- **100 curated Odisha locations** — including hidden gems far beyond the typical tourist trail
- **Foursquare API integration** — real-time nearby hotels and restaurants based on destination coordinates
- **JWT authentication** — secure register/login with bcrypt password hashing
- **RAG pipeline** — JSON-based location search feeding context to Groq LLM for rich narration
- **Hidden gem tagging** — `isHiddenGem: true` flags offbeat spots in the itinerary timeline

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Flask, Flask-JWT-Extended, Flask-Bcrypt |
| Database | MongoDB Atlas (via Flask-PyMongo) |
| LLM | Groq API — `llama-3.3-70b-versatile` |
| Places API | Foursquare Places API v3 |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
TRAVELMAiT-V2/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── planner/       # MoodForm, PlannerPage, ItineraryTimeline
│   │   │   ├── chat/          # ChatPage, ChatBubble, ItineraryCard
│   │   │   └── sections/      # Hero, Destinations, HowItWorks, FAQ
│   │   ├── pages/             # Home, Login, Register, PlanTrip, ItineraryView
│   │   ├── context/           # AuthContext
│   │   └── hooks/             # useAuth, useSlideshow
│   └── vercel.json
│
├── backend/                   # Flask API
│   ├── app/
│   │   ├── routes/            # auth.py, itinerary.py, chat.py
│   │   └── utils/             # embedder.py, chroma_client.py, auth_helpers.py
│   ├── data/
│   │   └── odisha_100_locations.json
│   ├── run.py
│   └── requirements.txt
│
└── .gitignore
```

---

## How It Works

1. **User submits** destination, mood, duration, budget, and group type via the MoodForm
2. **Backend loads** relevant Odisha locations from the curated JSON dataset
3. **Foursquare API** fetches real nearby hotels and restaurants for the destination
4. **Groq LLM** receives the location context + Foursquare data and generates a structured day-by-day JSON itinerary
5. **Frontend renders** the itinerary as a beautiful timeline with time slots, descriptions, and hidden gem tags

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Groq API key
- Foursquare API key

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Create .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET_KEY=your_secret_key
# GROQ_API_KEY=your_groq_key
# FOURSQUARE_API_KEY=your_foursquare_key

python run.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/itinerary` | Generate AI itinerary (JWT required) |
| POST | `/api/chat` | Chat with TRAVELMAiT AI (JWT required) |

---

## Deployment

- **Frontend** deployed on [Vercel](https://vercel.com) with React Router rewrites via `vercel.json`
- **Backend** deployed on [Render](https://render.com) as a Python web service using Gunicorn

---

## Team

Built for **Smart India Hackathon 2025** — reached **Top 50 nationally**.

| Name | Role |
|---|---|
| Anshuman Dev | Frontend, RAG pipeline, deployment |
| Ardhi Gagan | Backend, MongoDB, Flask API |

---

## Links

- 🌐 **Live:** [travelmait-v2.vercel.app](https://travelmait-v2.vercel.app)
- 💻 **GitHub:** [github.com/anshhh1101/TravelMAiT-V2](https://github.com/anshhh1101/TravelMAiT-V2)