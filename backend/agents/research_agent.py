from langchain_groq import ChatGroq
from tavily import TavilyClient
from pydantic import SecretStr
from backend.config import settings
from backend.rag.retriever import retrieve_as_string

class ResearchAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=SecretStr(settings.GROQ_API_KEY),
            model="llama-3.3-70b-versatile"
        )
        self.tavily = TavilyClient(api_key=settings.TAVILY_API_KEY)

    def run(self, job_role: str, company: str = "") -> dict:
        print("[Research Agent] running...")

        # ── Web Search ──────────────────────────
        web_context = ""
        try:
            query = f"{job_role} {company} job requirements skills 2024"
            search_results = self.tavily.search(query=query, max_results=5)
            web_context = "\n".join([
                r.get("content", "")
                for r in search_results.get("results", [])
            ])
        except Exception as e:
            print(f"[Research Agent] Tavily web search skipped: {e}")
            web_context = f"Target Role Market Analysis for {job_role} at {company or 'Tech Companies'}."

        # ── RAG Context ─────────────────────────
        rag_context = retrieve_as_string(job_role)

        # ── LLM Analysis ────────────────────────
        prompt = f"""
        You are a career research expert.
        Analyze the following information about the role: {job_role}
        
        Web Search Results:
        {web_context}
        
        Additional Context:
        {rag_context}
        
        Provide a structured summary including:
        1. Key responsibilities
        2. Required skills (technical and soft)
        3. Market trends
        4. Top hiring companies
        5. Average salary range
        
        Be specific and concise.
        """

        response = self.llm.invoke(prompt)

        return {
            "agent": "research",
            "job_role": job_role,
            "company": company,
            "research_summary": str(response.content),
            "sources": [r.get("url", "") for r in search_results.get("results", [])]
        }