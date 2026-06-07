from sentence_transformers import SentenceTransformer

# Load once at startup — reused by both ingest.py and chat.py
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def embed(text: str) -> list:
    return get_model().encode(text).tolist()