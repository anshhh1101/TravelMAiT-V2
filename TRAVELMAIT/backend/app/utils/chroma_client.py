import os
import chromadb

# Path to the vectorstore folder (next to this utils/ directory)
VECTORSTORE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "vectorstore"
)

_client     = None
_collection = None

def get_collection():
    global _client, _collection
    if _collection is None:
        _client     = chromadb.PersistentClient(path=VECTORSTORE_PATH)
        _collection = _client.get_or_create_collection(
            name="odisha_places",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


def query_places(query_embedding: list, n_results: int = 8) -> list:
    """
    Run a vector similarity search and return matching place dicts.
    """
    collection = get_collection()

    if collection.count() == 0:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, collection.count()),
        include=["documents", "metadatas", "distances"]
    )

    places = []
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i]
        places.append({
            "id":             results["ids"][0][i],
            "name":           meta.get("name"),
            "region":         meta.get("region"),
            "district":       meta.get("district"),
            "type":           meta.get("type"),
            "description":    meta.get("description"),
            "short_story":    meta.get("short_story"),
            "mood_tags":      meta.get("mood_tags", "").split("|"),
            "tags":           meta.get("tags", "").split("|"),
            "best_season":    meta.get("best_season", "").split("|"),
            "entry_fee_inr":  int(meta.get("entry_fee_inr", 0)),
            "photo_url":      meta.get("photo_url", ""),
            "score":          round(1 - results["distances"][0][i], 3),
        })

    return places