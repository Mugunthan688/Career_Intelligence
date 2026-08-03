from pinecone import Pinecone, ServerlessSpec
from backend.config import settings

# ── Initialize Pinecone Client ──────────────────
def init_pinecone():
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)

    # Create index if it doesn't exist
    existing_indexes = [i.name for i in pc.list_indexes()]

    if settings.PINECONE_INDEX_NAME not in existing_indexes:
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
    else:
        print(f"[Pinecone] Index '{settings.PINECONE_INDEX_NAME}' already exists")

    return pc.Index(settings.PINECONE_INDEX_NAME)