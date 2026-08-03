from sentence_transformers import SentenceTransformer
from backend.utils.helpers import chunk_text
from backend.rag.pinecone_client import init_pinecone
import uuid

# ── Load Embedding Model ─────────────────────────
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text: str) -> list:
    embedding = model.encode(text).tolist()
    return embedding

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