import os
import sys

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        reconfig = getattr(sys.stdout, "reconfigure")
        reconfig(encoding="utf-8")
    except Exception:
        pass

def setup_langsmith():
    """
    Setup LangSmith monitoring — silently skips if key is missing or invalid.
    Never blocks the main pipeline.
    """
    try:
        api_key = os.getenv("LANGCHAIN_API_KEY", "")

        if not api_key or api_key == "your_langsmith_api_key_here":
            print("[LangSmith] Skipped — no valid API key")
            return

        os.environ["LANGCHAIN_API_KEY"]      = api_key
        os.environ["LANGCHAIN_TRACING_V2"]   = os.getenv("LANGCHAIN_TRACING_V2", "false")
        os.environ["LANGCHAIN_PROJECT"]      = os.getenv("LANGCHAIN_PROJECT", "career-intelligence-os")
        print("[LangSmith] Monitoring active")

    except Exception as e:
        print(f"[LangSmith] Setup failed silently: {e}")