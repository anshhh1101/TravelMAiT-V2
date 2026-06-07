"""
Run this ONCE from the backend/ folder:
    python ingest.py

It reads data/odisha_100_locations.json, embeds every place
using sentence-transformers, and saves them into vectorstore/.
"""

import json
import os
import sys

# ── make sure app package is importable ──────────
sys.path.insert(0, os.path.dirname(__file__))

from app.utils.embedder     import embed
from app.utils.chroma_client import get_collection

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "odisha_100_locations.json")


def make_document(place: dict) -> str:
    """
    Combine all meaningful fields into a single text blob for embedding.
    The richer this text, the better the semantic search results.
    """
    mood  = ", ".join(place.get("mood_tags", []))
    tags  = ", ".join(place.get("tags", []))
    season = ", ".join(place.get("best_season", []))
    fee   = "free entry" if place.get("entry_fee_inr", 0) == 0 else f"entry fee ₹{place['entry_fee_inr']}"

    return (
        f"Name: {place['name']}. "
        f"Region: {place['region']}, {place['district']}. "
        f"Type: {place['type']}. "
        f"Mood: {mood}. "
        f"Tags: {tags}. "
        f"Best season: {season}. "
        f"Entry: {fee}. "
        f"Description: {place['description']} "
        f"Story: {place.get('short_story', '')}"
    )


def main():
    print("Loading JSON data...")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        places = json.load(f)

    collection = get_collection()

    # Clear existing data so re-runs don't duplicate
    existing = collection.count()
    if existing > 0:
        print(f"Clearing {existing} existing entries...")
        collection.delete(where={"name": {"$ne": ""}})

    print(f"Embedding {len(places)} places — this takes ~30 seconds on first run...")

    ids       = []
    documents = []
    embeddings = []
    metadatas  = []

    for i, place in enumerate(places):
        doc = make_document(place)
        vec = embed(doc)

        ids.append(place["id"])
        documents.append(doc)
        embeddings.append(vec)
        metadatas.append({
            "name":          place["name"],
            "region":        place["region"],
            "district":      place["district"],
            "type":          place["type"],
            "description":   place["description"],
            "short_story":   place.get("short_story", ""),
            "mood_tags":     "|".join(place.get("mood_tags", [])),
            "tags":          "|".join(place.get("tags", [])),
            "best_season":   "|".join(place.get("best_season", [])),
            "entry_fee_inr": str(place.get("entry_fee_inr", 0)),
            "photo_url":     place.get("photo_url", ""),
        })

        print(f"  [{i+1:03d}/{len(places)}] {place['name']}")

    # Upsert in one batch
    collection.upsert(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    print(f"\n✅ Done! {collection.count()} places stored in vectorstore/")


if __name__ == "__main__":
    main()