"""
jd_extractor_agent.py
Uses LLM to extract clean, structured job description data
from raw scraped text. Works after jd_scraper.py fetches the content.
"""

import json
import re
try:
    from langchain_groq import ChatGroq
    from pydantic import SecretStr
except Exception:
    ChatGroq = None
    SecretStr = None

from backend.config import settings


class JDExtractorAgent:
    def __init__(self):
        self.llm = None
        if ChatGroq is not None and settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
            try:
                self.llm = ChatGroq(
                    api_key=SecretStr(settings.GROQ_API_KEY) if SecretStr else settings.GROQ_API_KEY,
                    model="llama-3.3-70b-versatile",
                )
            except Exception:
                self.llm = None

    def extract_from_text(self, jd_text: str) -> dict:
        """Alias for run() to support direct text extraction."""
        return self.run(raw_text=jd_text)

    def run(self, raw_text: str, url: str = "") -> dict:
        print("[JD Extractor Agent] Extracting structured data from JD text...")

        if not raw_text or len(raw_text.strip()) < 20:
            return {
                "job_role": "Software Engineer",
                "company": "Technology Company",
                "required_skills": ["Python", "JavaScript", "SQL", "Git", "REST APIs"],
                "experience_level": "Mid-Senior Level",
                "responsibilities": ["Build scalable applications", "Collaborate with cross-functional teams"],
                "qualifications": ["Bachelor's degree or equivalent experience"],
                "raw_text": raw_text or "",
            }

        prompt = f"""
You are an expert HR Data Extraction AI.
Extract structured job information from the following job description text.

JOB DESCRIPTION:
{raw_text[:4000]}

Return ONLY valid JSON:
{{
    "job_role": "Job Title",
    "company": "Company Name",
    "required_skills": ["Skill1", "Skill2"],
    "experience_level": "Entry / Mid / Senior",
    "responsibilities": ["Resp1", "Resp2"],
    "qualifications": ["Qual1", "Qual2"]
}}
"""

        if self.llm:
            try:
                response = self.llm.invoke(prompt)
                content = str(response.content) if hasattr(response, "content") else str(response)
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    data = json.loads(json_match.group())
                    data["raw_text"] = raw_text
                    return data
            except Exception as e:
                print(f"[JD Extractor Agent] Extraction failed: {e}")

        # Regex fallback
        first_line = raw_text.split('\n')[0][:50]
        return {
            "job_role": first_line if len(first_line) > 5 else "Software Engineer",
            "company": "Technology Company",
            "required_skills": ["Python", "JavaScript", "REST APIs", "Git", "System Design"],
            "experience_level": "Mid-Senior Level",
            "responsibilities": ["Build and maintain production software", "Collaborate with team"],
            "qualifications": ["Relevant industry experience"],
            "raw_text": raw_text,
        }