from backend.rag.pinecone_client import init_pinecone
from backend.rag.embedder import embed_text

def retrieve_context(query: str, top_k: int = 5) -> list[str]:
    index = init_pinecone()

    # Embed the query
    query_embedding = embed_text(query)

    # Search Pinecone
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    # Extract text from results
    contexts = []
    matches = getattr(results, "matches", []) or []
    for match in matches:
        if hasattr(match, "metadata") and match.metadata and "text" in match.metadata:
            contexts.append(match.metadata["text"])

    return contexts

def retrieve_as_string(query: str, top_k: int = 5) -> str:
    contexts = retrieve_context(query, top_k)
    if not contexts:
        return "No relevant context found."
    return "\n\n".join(contexts)