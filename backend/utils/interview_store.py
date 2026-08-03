"""
interview_store.py
Persists mock interview sessions to a JSON file on disk.
Each session stores: user email, job role, questions, answers,
scores, feedback and timestamp.
"""

import os
import json
import uuid
from datetime import datetime


# ── Storage file path ────────────────────────────
STORE_FILE = os.path.join(os.path.dirname(__file__), "..", "interview_history.json")
STORE_FILE = os.path.normpath(STORE_FILE)


# ════════════════════════════════════════════════
# FILE HELPERS
# ════════════════════════════════════════════════

def _load_store() -> dict:
    """Load entire store from JSON file."""
    if not os.path.exists(STORE_FILE):
        return {}
    try:
        with open(STORE_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}


def _save_store(data: dict):
    """Save entire store to JSON file."""
    try:
        with open(STORE_FILE, "w") as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        print(f"⚠️  Could not save interview history: {e}")


# ════════════════════════════════════════════════
# PUBLIC API
# ════════════════════════════════════════════════

def save_session(
    user_email:   str,
    job_role:     str,
    questions:    list,
    answers:      list,
    scores:       list,
    feedbacks:    list,
) -> dict:
    """
    Save a completed interview session.
    Returns the saved session dict with generated id.
    """
    store = _load_store()

    if user_email not in store:
        store[user_email] = []

    # ── Build session object ──────────────────────
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0

    session = {
        "id":         str(uuid.uuid4()),
        "user_email": user_email,
        "job_role":   job_role,
        "timestamp":  datetime.utcnow().isoformat(),
        "avg_score":  avg_score,
        "total_questions": len(questions),
        "qa_pairs": [
            {
                "question": questions[i] if i < len(questions) else "",
                "answer":   answers[i]   if i < len(answers)   else "",
                "score":    scores[i]    if i < len(scores)    else 0,
                "feedback": feedbacks[i] if i < len(feedbacks) else {},
            }
            for i in range(len(questions))
        ],
    }

    store[user_email].append(session)

    # ── Keep only last 20 sessions per user ───────
    store[user_email] = store[user_email][-20:]

    _save_store(store)
    print(f"✅ Session saved for {user_email} — score {avg_score}/10")
    return session


def get_sessions(user_email: str) -> list:
    """
    Get all interview sessions for a user, newest first.
    """
    store = _load_store()
    sessions = store.get(user_email, [])
    return list(reversed(sessions))   # newest first


def get_session_by_id(user_email: str, session_id: str) -> dict | None:
    """Get a specific session by ID."""
    sessions = get_sessions(user_email)
    for s in sessions:
        if s["id"] == session_id:
            return s
    return None


def delete_session(user_email: str, session_id: str) -> bool:
    """Delete a specific session. Returns True if deleted."""
    store = _load_store()
    sessions = store.get(user_email, [])
    original_count = len(sessions)
    store[user_email] = [s for s in sessions if s["id"] != session_id]
    _save_store(store)
    return len(store[user_email]) < original_count


def get_progress_data(user_email: str) -> list:
    """
    Get score progression data for charts.
    Returns list of {date, avg_score, job_role} sorted oldest first.
    """
    sessions = list(reversed(get_sessions(user_email)))  # oldest first
    return [
        {
            "session":   i + 1,
            "date":      s["timestamp"][:10],
            "avg_score": s["avg_score"],
            "job_role":  s["job_role"],
        }
        for i, s in enumerate(sessions)
    ]