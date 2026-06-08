import os, json

DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data", "odisha_100_locations.json"
)

_places = None

def load_places():
    global _places
    if _places is None:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            _places = json.load(f)
    return _places

def query_places(query_embedding: list, n_results: int = 8) -> list:
    places = load_places()
    return places[:n_results]