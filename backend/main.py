import sys

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        reconfig = getattr(sys.stdout, "reconfigure")
        reconfig(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routes import router

app = FastAPI(
    title="Career Intelligence OS",
    description="Multi-Agent AI Career Guidance Platform",
    version="1.0.0"
)

# ── CORS Middleware ──────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Include Routes ───────────────────────────────
app.include_router(router)

# ── Health Check ────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "running",
        "project": "Career Intelligence OS",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}