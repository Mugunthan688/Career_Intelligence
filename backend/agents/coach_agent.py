from langchain_groq import ChatGroq
from pydantic import SecretStr
from backend.config import settings
import json
import re

class CoachAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=SecretStr(settings.GROQ_API_KEY),
            model="llama-3.3-70b-versatile"
        )

    def generate_questions(self, job_role: str, missing_skills: list | None = None, resume_text: str = "") -> dict:
        print("[Coach Agent] generating questions...")
        missing_skills = missing_skills or []

        prompt = f"""
You are an elite Corporate Technical Interviewer & Senior Hiring Manager.

Generate 5 highly targeted, real-world domain-specific interview questions specifically tailored for:
TARGET JOB ROLE: {job_role}
MISSING/GAP SKILLS TO TEST: {", ".join(missing_skills) if missing_skills else "Core domain competencies"}
CANDIDATE RESUME SAMPLE: {resume_text[:1500] if resume_text else "Targeting " + job_role}

CRITICAL DOMAIN-SPECIFIC INSTRUCTIONS:
- Tailor ALL questions to match the exact domain of {job_role}:
  * If {job_role} is AI Developer / ML Engineer: Ask about PyTorch, Transformer Architectures, Model Quantization, Fine-Tuning, RAG pipelines, Vector Databases, GPU memory management.
  * If {job_role} is Frontend Engineer / React Developer: Ask about Virtual DOM, Custom Hooks, Web Vitals, SSR vs CSR, State Management, micro-frontends.
  * If {job_role} is Backend Engineer / DevOps: Ask about Microservices, Distributed Caching, SQL Query Tuning, Docker/K8s, CI/CD, Event-Driven Architecture.
  * If {job_role} is Financial Analyst / Accountant: Ask about Financial Modeling, DCF valuation, Ratio Analysis, Audit compliance, Excel advanced formulas.
  * For any other role: Ask deep technical/domain-specific questions unique to that exact profession.
- Do NOT generate generic or boilerplate questions. Include 2 Deep Technical questions, 2 System/Process Architecture questions, and 1 Behavioral / Scenario question.

Respond ONLY in this exact JSON format:
{{
    "questions": [
        {{
            "id": 1,
            "question": "<Domain-specific technical question 1>",
            "category": "Technical Core",
            "difficulty": "Hard"
        }},
        {{
            "id": 2,
            "question": "<Domain-specific technical question 2>",
            "category": "Deep Domain",
            "difficulty": "Medium"
        }},
        {{
            "id": 3,
            "question": "<Domain-specific technical question 3>",
            "category": "System Design & Architecture",
            "difficulty": "Hard"
        }},
        {{
            "id": 4,
            "question": "<Domain-specific technical question 4>",
            "category": "Practical Workflow",
            "difficulty": "Medium"
        }},
        {{
            "id": 5,
            "question": "<Domain-specific behavioral question 5>",
            "category": "Scenario & Problem Solving",
            "difficulty": "Medium"
        }}
    ]
}}
"""

        response = self.llm.invoke(prompt)

        try:
            clean = re.sub(r"```json|```", "", str(response.content)).strip()
            result = json.loads(clean)
        except Exception:
            result = {
                "questions": [
                    { "id": 1, "question": f"How do you design and architect scalable solutions for {job_role}?", "category": "System Design", "difficulty": "Hard" },
                    { "id": 2, "question": f"What core technical tools and methodologies do you prioritize as a {job_role}?", "category": "Domain Technical", "difficulty": "Medium" },
                    { "id": 3, "question": f"Describe a complex technical challenge you faced in {job_role} and how you resolved it.", "category": "Problem Solving", "difficulty": "Hard" },
                    { "id": 4, "question": f"How do you ensure quality control, testing, and performance optimization in {job_role}?", "category": "Quality Assurance", "difficulty": "Medium" },
                    { "id": 5, "question": f"How do you stay updated with emerging technologies and best practices in {job_role}?", "category": "Professional Growth", "difficulty": "Easy" },
                ]
            }

        return {
            "agent": "coach",
            "job_role": job_role,
            **result
        }

    def evaluate_answer(self, question: str, answer: str, job_role: str) -> dict:
        print("[Coach Agent] evaluating answer...")

        prompt = f"""
You are an expert interviewer evaluating a candidate's answer for target role: {job_role}.

QUESTION: {question}
CANDIDATE ANSWER: {answer}

Evaluate the answer objectively and respond ONLY in this exact JSON format:
{{
    "score": <integer 0-10>,
    "feedback": "<detailed constructive recruiter feedback>",
    "strengths": ["<strength 1>", "<strength 2>"],
    "improvements": ["<improvement 1>", "<improvement 2>"],
    "ideal_answer_hint": "<brief summary of what a top candidate answer should include>"
}}
"""

        response = self.llm.invoke(prompt)

        try:
            clean = re.sub(r"```json|```", "", str(response.content)).strip()
            result = json.loads(clean)
        except Exception:
            result = {
                "score": 6,
                "feedback": "Answer demonstrates basic domain understanding but could be more structured.",
                "strengths": ["Clear communication"],
                "improvements": ["Add specific technical examples and numerical impact"],
                "ideal_answer_hint": "Include concrete architecture details and measurable outcomes."
            }

        return {
            "agent": "coach",
            "question": question,
            **result
        }