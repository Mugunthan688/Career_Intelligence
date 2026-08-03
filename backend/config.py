from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):

    # ── LLM Provider ────────────────────────────
    GROQ_API_KEY: str = ""

    # ── Pinecone ────────────────────────────────
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "career-intelligence"

    # ── Tavily ──────────────────────────────────
    TAVILY_API_KEY: str = ""

    # ── LangSmith ───────────────────────────────
    LANGCHAIN_API_KEY: str = ""
    LANGCHAIN_TRACING_V2: str = "true"
    LANGCHAIN_PROJECT: str = "career-intelligence-os"

    # ── JWT Auth ────────────────────────────────
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ── FastAPI ─────────────────────────────────
    BACKEND_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        extra = "allow"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()