from langchain_groq import ChatGroq
from pydantic import SecretStr
from backend.config import settings
import json
import re

class ScreenerAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=SecretStr(settings.GROQ_API_KEY),
            model="llama-3.3-70b-versatile"
        )

    def run(self, resume_text: str, job_role: str, research_summary: str) -> dict:
        print("[Screener Agent] running...")

        prompt = f"""
You are a rigorous, highly accurate corporate Resume Screener & Recruiter AI.

Analyze the uploaded resume against the target job role and requirements. Be EXTREMELY CRITICAL and REALISTIC.

TARGET JOB ROLE: {job_role}
JOB REQUIREMENTS & CONTEXT:
{research_summary}

CANDIDATE RESUME TEXT:
{resume_text}

SCORING INSTRUCTIONS (0-100%):
- If the candidate's background/resume is completely IRRELEVANT or mismatched to {job_role} (e.g. Finance/Accountant applying for React Engineer, or zero technical overlap), score between 10% to 35%. DO NOT give high scores to irrelevant resumes.
- If the candidate has partial skills matching {job_role} but lacks key core requirements, score between 40% to 65%.
- If the candidate is a strong, highly qualified match with key technologies and relevant domain experience, score between 75% to 95%.

Respond ONLY in this exact JSON format:
{{
    "score": <integer score 0-100 based strictly on relevance>,
    "match_score": <same integer score 0-100>,
    "matched_skills": [<list of actual skills explicitly found in the resume that match {job_role}>],
    "missing_skills": [<list of critical required skills for {job_role} NOT found in the resume>],
    "experience_match": "<Strong/Moderate/Weak>",
    "education_match": "<Strong/Moderate/Weak>",
    "summary": "<2-3 sentence honest recruiter assessment of candidate fit>"
}}
"""

        response = self.llm.invoke(prompt)

        try:
            clean = re.sub(r"```json|```", "", str(response.content)).strip()
            result = json.loads(clean)
        except Exception:
            result = {
                "score": 35,
                "match_score": 35,
                "matched_skills": [],
                "missing_skills": ["Core domain skills"],
                "experience_match": "Weak",
                "education_match": "Weak",
                "summary": "Resume content requires optimization for target role requirements."
            }

        return {
            "agent": "screener",
            "job_role": job_role,
            **result
        }