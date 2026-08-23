try:
    from pinecone import Pinecone, ServerlessSpec
except Exception:
    Pinecone = None
    ServerlessSpec = None

from backend.config import settings

class DummyPineconeIndex:
    def __init__(self):
        self.store = []

    def upsert(self, vectors=None, **kwargs):
        if vectors:
            self.store.extend(vectors)
        return {"upserted_count": len(vectors or [])}

    def query(self, vector=None, top_k=5, include_metadata=True, **kwargs):
        class Match:
            def __init__(self, meta):
                self.metadata = meta
        return type("QueryResult", (), {"matches": [Match(v.get("metadata", {})) for v in self.store[:top_k]]})()

# ── Initialize Pinecone Client ──────────────────
_dummy_index = None

def init_pinecone():
    global _dummy_index
    if not settings.PINECONE_API_KEY or settings.PINECONE_API_KEY == "your_pinecone_api_key_here" or Pinecone is None:
        if _dummy_index is None:
            _dummy_index = DummyPineconeIndex()
        return _dummy_index

    try:
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        existing_indexes = [i.name for i in pc.list_indexes()]

        if settings.PINECONE_INDEX_NAME not in existing_indexes and ServerlessSpec is not None:
            pc.create_index(
                name=settings.PINECONE_INDEX_NAME,
                dimension=384,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )
            print(f"[Pinecone] Index '{settings.PINECONE_INDEX_NAME}' created")
        return pc.Index(settings.PINECONE_INDEX_NAME)
    except Exception as e:
        print(f"[Pinecone] Fallback to in-memory index: {e}")
        if _dummy_index is None:
            _dummy_index = DummyPineconeIndex()
        return _dummy_index