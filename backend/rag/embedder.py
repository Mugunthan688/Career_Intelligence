try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None

from backend.utils.helpers import chunk_text
from backend.rag.pinecone_client import init_pinecone
import uuid

# ── Load Embedding Model Lazily ─────────────────
_model = None

def get_model():
    global _model
    if _model is None and SentenceTransformer is not None:
        try:
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception:
            _model = None
    return _model

def embed_text(text: str) -> list:
    model = get_model()
    if model is not None:
        return model.encode(text).tolist()
    # Lightweight deterministic hash fallback
    import hashlib
    h = hashlib.sha256(text.encode('utf-8')).digest()
    return [(b / 255.0) for b in h[:384]] if len(h) >= 384 else [(b / 255.0) for b in (h * 12)[:384]]

def embed_and_store(text: str, metadata: dict) -> str:
    index = init_pinecone()
    chunks = chunk_text(text, chunk_size=200)

    vectors = []
    for chunk in chunks:
        vector_id = str(uuid.uuid4())
        embedding = embed_text(chunk)
        vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": {**metadata, "text": chunk}
        })

    # Store in Pinecone
    index.upsert(vectors=vectors)
    print(f"[Embedder] Stored {len(vectors)} chunks in Pinecone")
    return f"Stored {len(vectors)} chunks"