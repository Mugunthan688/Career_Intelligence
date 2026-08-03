"""
jd_extractor_agent.py
Uses LLM to extract clean, structured job description data
from raw scraped text. Works after jd_scraper.py fetches the content.
"""

import json
import re
from langchain_groq import ChatGroq
from pydantic import SecretStr
from backend.config import settings


class JDExtractorAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=SecretStr(settings.GROQ_API_KEY),
            model="llama-3.3-70b-versatile",
        )

    def run(self, raw_text: str, url: str = "") -> dict:
        """
        Extract structured job description from raw text.

        Returns:
            job_role, company, location, experience_required,
            skills_required, responsibilities, nice_to_have,
            salary_range, job_type, summary
        """
        print("[JD Extractor Agent] running...")

        if not raw_text or len(raw_text.strip()) < 50:
            return self._empty_result("No content to extract from")

        # Trim to avoid token overflow
        trimmed_text = raw_text[:4000]

        prompt = f"""
You are an expert job description parser.

Extract structured information from this job description text and respond ONLY in this exact JSON format — no extra text, no markdown:

{{
    "job_role": "<exact job title>",
    "company": "<company name>",
    "location": "<city, country or Remote>",
    "job_type": "<Full-time / Part-time / Contract / Remote>",
    "experience_required": "<e.g. 3-5 years>",
    "salary_range": "<salary range if mentioned, else empty string>",
    "skills_required": ["skill1", "skill2", "skill3"],
    "responsibilities": ["responsibility1", "responsibility2"],
    "nice_to_have": ["optional skill1", "optional skill2"],
    "summary": "<2 sentence summary of the role>"
}}

Job Description Text:
{trimmed_text}

Source URL: {url}

Rules:
- Extract ONLY what is explicitly mentioned in the text
- skills_required must be a list of specific technical/soft skills
- responsibilities must be a list of bullet points (max 8)
- nice_to_have should be skills mentioned as optional or bonus
- If any field is not mentioned, use an empty string or empty list
- Respond ONLY with the JSON object, nothing else
"""

        response_text = ""
        try:
            response = self.llm.invoke(prompt)
            response_text = str(response.content)
            clean    = re.sub(r"```json|```", "", response_text).strip()
            result   = json.loads(clean)

            # Validate required fields exist
            result.setdefault("job_role",            "")
            result.setdefault("company",              "")
            result.setdefault("location",             "")
            result.setdefault("job_type",             "")
            result.setdefault("experience_required",  "")
            result.setdefault("salary_range",         "")
            result.setdefault("skills_required",      [])
            result.setdefault("responsibilities",     [])
            result.setdefault("nice_to_have",         [])
            result.setdefault("summary",              "")

            result["source_url"] = url
            result["success"]    = True

            print(f"✅ JD extracted: {result.get('job_role')} at {result.get('company')}")
            return result

        except json.JSONDecodeError:
            # Try to extract partial data if JSON parse fails
            print("⚠️  JSON parse failed — returning partial data")
            return self._partial_result(response_text, url)

        except Exception as e:
            print(f"❌ JD Extractor failed: {e}")
            return self._empty_result(str(e))

    def extract_from_text(self, jd_text: str) -> dict:
        """
        Extract JD from plain text (when user pastes JD directly).
        Same logic, no URL needed.
        """
        return self.run(jd_text, url="manual_input")

    def _empty_result(self, error: str = "") -> dict:
        return {
            "success":              False,
            "error":                error,
            "job_role":             "",
            "company":              "",
            "location":             "",
            "job_type":             "",
            "experience_required":  "",
            "salary_range":         "",
            "skills_required":      [],
            "responsibilities":     [],
            "nice_to_have":         [],
            "summary":              "",
            "source_url":           "",
        }

    def _partial_result(self, raw_content: str, url: str) -> dict:
        """Best-effort extraction when JSON parsing fails."""
        result = self._empty_result()
        result["success"]    = True
        result["source_url"] = url

        # Try to find job role from first line
        lines = [l.strip() for l in raw_content.split('\n') if l.strip()]
        if lines:
            result["summary"] = lines[0][:200]

        return result


    