import re
from datetime import datetime

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\.,!?-]', '', text)
    return text.strip()

def chunk_text(text: str, chunk_size: int = 500) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def get_timestamp() -> str:
    return datetime.utcnow().isoformat()

def format_score(score: float) -> str:
    return f"{round(score, 1)}%"