from langchain_groq import ChatGroq
from pydantic import SecretStr
from backend.config import settings
import json
import re

class AnalyticsAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=SecretStr(settings.GROQ_API_KEY),
            model="llama-3.3-70b-versatile"
        )

    def run(self, job_role: str, matched_skills: list, missing_skills: list, score: float) -> dict:
        print("[Analytics Agent] running...")

        prompt = f"""
        You are a career analytics expert.
        
        Job Role: {job_role}
        Resume Match Score: {score}
        Matched Skills: {", ".join(matched_skills)}
        Missing Skills: {", ".join(missing_skills)}
        
        Generate analytics in this exact JSON format:
        {{
            "readiness_score": <number 0-100>,
            "skill_heatmap": [
                {{
                    "skill": "<skill name>",
                    "level": "<High/Medium/Low>",
                    "status": "<matched/missing>"
                }}
            ],
            "salary_benchmarks": {{
                "entry_level": "<salary range>",
                "mid_level": "<salary range>",
                "senior_level": "<salary range>"
            }},
            "learning_roadmap": [
                {{
                    "skill": "<missing skill>",
                    "resource": "<recommended resource>",
                    "duration": "<time to learn>"
                }}
            ],
            "overall_recommendation": "<Strong/Moderate/Weak> candidate"
        }}
        
        Respond with JSON only. No extra text.
        """

        response = self.llm.invoke(prompt)

        try:
            clean = re.sub(r"```json|```", "", str(response.content)).strip()
            result = json.loads(clean)
        except Exception:
            result = {
                "readiness_score": score,
                "skill_heatmap": [],
                "salary_benchmarks": {},
                "learning_roadmap": [],
                "overall_recommendation": "Could not generate analytics"
            }

        return {
            "agent": "analytics",
            "job_role": job_role,
            **result
        }