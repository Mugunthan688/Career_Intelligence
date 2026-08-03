BLOCKED_KEYWORDS = [
    "hack", "exploit", "violence", "abuse",
    "illegal", "weapon", "drug", "porn"
]

CAREER_KEYWORDS = [
    "resume", "job", "career", "skill", "interview",
    "salary", "company", "role", "experience", "hire"
]

def is_safe_input(text: str) -> bool:
    text_lower = text.lower()
    for word in BLOCKED_KEYWORDS:
        if word in text_lower:
            return False
    return True

def is_career_related(text: str) -> bool:
    text_lower = text.lower()
    return any(word in text_lower for word in CAREER_KEYWORDS)

def validate_input(text: str) -> dict:
    if not is_safe_input(text):
        return {"valid": False, "reason": "Input contains blocked content"}
    return {"valid": True, "reason": "OK"}