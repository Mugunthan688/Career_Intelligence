try:
    from langchain_groq import ChatGroq
    from pydantic import SecretStr
except Exception:
    ChatGroq = None
    SecretStr = None

try:
    from tavily import TavilyClient
except Exception:
    TavilyClient = None

from backend.config import settings
from backend.rag.retriever import retrieve_as_string

class ResearchAgent:
    def __init__(self):
        self.llm = None
        if ChatGroq is not None and settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
            try:
                self.llm = ChatGroq(
                    api_key=SecretStr(settings.GROQ_API_KEY) if SecretStr else settings.GROQ_API_KEY,
                    model="llama-3.3-70b-versatile"
                )
            except Exception:
                self.llm = None
        
        self.tavily = None
        if TavilyClient is not None and settings.TAVILY_API_KEY and settings.TAVILY_API_KEY != "your_tavily_api_key_here":
            try:
                self.tavily = TavilyClient(api_key=settings.TAVILY_API_KEY)
            except Exception:
                self.tavily = None

    def run(self, job_role: str, company: str = "") -> dict:
        print("[Research Agent] running...")

        # ── Web Search ──────────────────────────
        web_context = ""
        if self.tavily:
            try:
                query = f"{job_role} {company} job requirements skills 2024"
                search_results = self.tavily.search(query=query, max_results=5)
                web_context = "\n".join([
                    r.get("content", "")
                    for r in search_results.get("results", [])
                ])
            except Exception as e:
                print(f"[Research Agent] Tavily failed: {e}")

        # ── Pinecone RAG Context ────────────────
        rag_context = ""
        try:
            rag_context = retrieve_as_string(f"{job_role} skills requirements", top_k=3)
        except Exception as e:
            print(f"[Research Agent] RAG retrieval failed: {e}")

        # ── Combine & Summarize ─────────────────
        combined_context = f"Web Search:\n{web_context}\n\nInternal Knowledge:\n{rag_context}"

        prompt = f"""
        You are a job market research expert.
        Analyze this context for the role '{job_role}' at '{company}':
        {combined_context}

        Provide a concise summary of:
        1. Required technical skills
        2. Experience level expectations
        3. Key responsibilities
        """

        if self.llm:
            try:
                response = self.llm.invoke(prompt)
                summary_text = str(response.content) if hasattr(response, "content") else str(response)
            except Exception as e:
                print(f"[Research Agent] LLM failed: {e}")
                summary_text = f"Live market requirements for {job_role}: Core architecture, modern frameworks, data structures, cloud infrastructure, and CI/CD pipelines."
        else:
            summary_text = f"Live market requirements for {job_role}: Core architecture, modern frameworks, data structures, cloud infrastructure, and CI/CD pipelines."

        return {
            "job_role": job_role,
            "company": company,
            "research_summary": summary_text,
            "web_context_used": bool(web_context),
            "rag_context_used": bool(rag_context)
        }