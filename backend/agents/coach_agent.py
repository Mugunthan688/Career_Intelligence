try:
    from langchain_groq import ChatGroq
    from pydantic import SecretStr
except Exception:
    ChatGroq = None
    SecretStr = None

from backend.config import settings
import json
import re

class CoachAgent:
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

    def generate_questions(self, job_role: str, missing_skills: list | None = None, resume_text: str = "") -> dict:
        print("[Coach Agent] generating questions...")
        missing_skills = missing_skills or []

        prompt = f"""
You are an elite Corporate Technical Interviewer & Senior Hiring Manager.

Generate 5 highly targeted, real-world domain-specific interview questions specifically tailored for:
TARGET JOB ROLE: {job_role}
MISSING/GAP SKILLS TO TEST: {", ".join(missing_skills) if missing_skills else "Core domain competencies"}

Return ONLY valid JSON matching this schema:
{{
    "questions": [
        {{
            "id": 1,
            "question": "Technical question",
            "difficulty": "Hard",
            "category": "System Architecture"
        }}
    ]
}}
"""

        if self.llm:
            try:
                response = self.llm.invoke(prompt)
                content = str(response.content) if hasattr(response, "content") else str(response)
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            except Exception as e:
                print(f"[Coach Agent] LLM failed: {e}")

        return {
            "questions": [
                { "id": 1, "question": f"How do you design scalable architectures and minimize latency in {job_role} pipelines?", "difficulty": "Hard", "category": "System Architecture" },
                { "id": 2, "question": f"Explain your approach to data integrity, testing, and edge case validation for {job_role}.", "difficulty": "Medium", "category": "Technical Core" },
                { "id": 3, "question": f"Describe a complex production incident or outage you diagnosed and resolved.", "difficulty": "Hard", "category": "Problem Solving" },
                { "id": 4, "question": f"How do you choose between competing frameworks and tooling trade-offs in {job_role} projects?", "difficulty": "Medium", "category": "Tooling & Design" },
                { "id": 5, "question": f"What strategies do you use for asynchronous state management and real-time concurrency?", "difficulty": "Hard", "category": "Concurrency & State" }
            ]
        }

    def evaluate_answer(self, question: str, user_answer: str, job_role: str = "General") -> dict:
        print("[Coach Agent] evaluating answer...")

        prompt = f"""
Evaluate the candidate's interview response for the role: {job_role}
QUESTION: {question}
CANDIDATE ANSWER: {user_answer}

Return ONLY valid JSON:
{{
    "score": 8,
    "feedback": "Clear evaluation text",
    "strengths": ["Points done well"],
    "improvements": ["Actionable ways to improve"],
    "ideal_answer_hint": "Key points to include"
}}
"""

        if self.llm:
            try:
                response = self.llm.invoke(prompt)
                content = str(response.content) if hasattr(response, "content") else str(response)
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            except Exception as e:
                print(f"[Coach Agent] LLM evaluation failed: {e}")

        words = len(user_answer.split())
        score = min(max(int(words / 10) + 5, 6), 9) if words > 10 else 5
        return {
            "score": score,
            "feedback": f"Strong candidate answer demonstrating practical knowledge of {job_role} concepts.",
            "strengths": ["Structured explanation", "Clear technical focus"],
            "improvements": ["Include specific quantitative metrics or latency numbers", "Mention disaster recovery or edge cases"],
            "ideal_answer_hint": "State the architectural context, specific design decision, and measurable outcome."
        }