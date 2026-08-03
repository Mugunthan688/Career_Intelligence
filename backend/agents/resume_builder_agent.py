"""
resume_builder_agent.py
Uses LLM to rewrite and improve resume content with high ATS keyword density,
STAR methodology, power action verbs, and role-specific technical terms.
"""

import json
import re
from langchain_groq import ChatGroq
from pydantic import SecretStr
from backend.config import settings


class ResumeBuilderAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=SecretStr(settings.GROQ_API_KEY),
            model="llama-3.3-70b-versatile",
        )

    def run(
        self,
        resume_text:     str,
        job_role:        str,
        jd_summary:      str    = "",
        matched_skills:  list | None = None,
        missing_skills:  list | None = None,
        research_summary:str    = "",
    ) -> dict:
        matched_skills = matched_skills or []
        missing_skills = missing_skills or []

        print(f"[Resume Builder Agent] Processing AI rewrite for role: {job_role}...")

        prompt = f"""
You are a World-Class Executive Resume Writer & Senior ATS Optimization Specialist.

Your objective is to perform a high-impact AI rewrite of the candidate's resume for maximum ATS score (95%+) and recruiter engagement for the target role: {job_role}.

TARGET JOB ROLE: {job_role}

JOB REQUIREMENTS & MARKET CONTEXT:
{jd_summary or research_summary or "Focus on industry best practices for " + job_role}

ORIGINAL RESUME TEXT:
{resume_text[:3500]}

MATCHED SKILLS: {", ".join(matched_skills[:12]) if matched_skills else "Detect from resume"}
CRITICAL MISSING / HIGH-VALUE ATS KEYWORDS TO INJECT: {", ".join(missing_skills[:12]) if missing_skills else "Inject industry standard keywords for " + job_role}

CRITICAL ATS REWRITE MANDATES:
1. HIGH-DENSITY KEYWORD INJECTION: Seamlessly inject top 10-15 industry-standard technical keywords, core frameworks, tools, and methodologies relevant to {job_role} into the Summary, Core Competencies, and Work Experience.
2. ATS POWER ACTION VERBS: Lead EVERY experience bullet point with high-impact ATS power verbs (e.g., Architected, Engineered, Spearheaded, Optimized, Orchestrated, Quantified, Deployed, Automated, Streamlined).
3. STAR METHODOLOGY WITH METRICS: Every single bullet point MUST follow the STAR framework: [Power Verb] + [Specific Technical Tool/Task] + [Quantified Result (% performance gain, $ efficiency, user scale, speed boost)].
4. EXPAND SKILLS LIST: Return a comprehensive, clean array of 12-18 relevant ATS technical skills categorized clearly.
5. PROFESSIONAL SUMMARY: Write an elite 3-4 sentence summary incorporating the candidate's years of experience, core technical mastery in {job_role}, and key quantified achievements.

Respond ONLY in this exact JSON format — no extra commentary:
{{
    "name": "<candidate full name>",
    "email": "<email>",
    "phone": "<phone>",
    "location": "<city, state/country>",
    "linkedin": "<linkedin URL>",
    "summary": "<elite 3-4 sentence professional summary loaded with ATS keywords for {job_role}>",
    "skills": ["<Keyword 1>", "<Keyword 2>", "<Keyword 3>", "<Keyword 4>", "<Keyword 5>", "<Keyword 6>", "<Keyword 7>", "<Keyword 8>", "<Keyword 9>", "<Keyword 10>", "<Keyword 11>", "<Keyword 12>"],
    "experience": [
        {{
            "role": "<exact job title>",
            "company": "<company name>",
            "duration": "<start - end dates>",
            "location": "<city>",
            "bullets": [
                "<STAR methodology bullet 1 with power verb, keywords, and metric>",
                "<STAR methodology bullet 2 with power verb, keywords, and metric>",
                "<STAR methodology bullet 3 with power verb, keywords, and metric>"
            ]
        }}
    ],
    "education": [
        {{
            "degree": "<degree>",
            "institution": "<university>",
            "year": "<year>",
            "grade": "<grade/GPA>"
        }}
    ],
    "certifications": ["<cert 1>", "<cert 2>"],
    "improvements_made": [
        "Injected high-impact ATS keywords for {job_role} across all sections",
        "Re-formatted work experience bullets using STAR methodology and strong power verbs",
        "Quantified project outcomes with numerical metrics and performance benchmarks",
        "Optimized skills hierarchy for maximum ATS parser keyword match"
    ]
}}
"""

        try:
            response = self.llm.invoke(prompt)
            clean    = re.sub(r"```json|```", "", str(response.content)).strip()
            result   = json.loads(clean)

            # Ensure all fields exist
            result.setdefault("name",              "Candidate")
            result.setdefault("email",             "")
            result.setdefault("phone",             "")
            result.setdefault("location",          "")
            result.setdefault("linkedin",          "")
            result.setdefault("summary",           "")
            result.setdefault("skills",            matched_skills + missing_skills[:5])
            result.setdefault("experience",        [])
            result.setdefault("education",         [])
            result.setdefault("certifications",    [])
            result.setdefault("improvements_made", [])

            result["job_role"] = job_role
            result["success"]  = True

            print(f"[Resume Builder Agent] Successfully built ATS-optimized resume for {result.get('name')} -> {job_role}")
            return result

        except json.JSONDecodeError:
            print("[Resume Builder Agent] JSON parse failed — returning fallback structure")
            return self._basic_result(resume_text, job_role, matched_skills, missing_skills)

        except Exception as e:
            print(f"[Resume Builder Agent] Failed: {e}")
            return {"success": False, "error": str(e)}

    def improve_section(self, section: str, content: str, job_role: str) -> str:
        """
        Improve a single resume section on demand.
        section: 'summary' | 'experience' | 'skills'
        """
        prompt = f"""
Improve this {section} section of a resume for the role: {job_role}

Original {section}:
{content}

Rules:
- Keep it concise and impactful with STAR methodology
- Use power action verbs and high-value ATS keywords for {job_role}
- Include numbers/metrics where applicable
- Return ONLY the improved text, no extra explanation
"""
        try:
            response = self.llm.invoke(prompt)
            return str(response.content).strip()
        except Exception:
            return content

    def _basic_result(
        self,
        resume_text:    str,
        job_role:       str,
        matched_skills: list,
        missing_skills: list,
    ) -> dict:
        """Fallback result with basic structure extracted from text."""
        lines = [l.strip() for l in resume_text.split('\n') if l.strip()]
        return {
            "success":         True,
            "name":            lines[0] if lines else "Candidate",
            "email":           "",
            "phone":           "",
            "location":        "",
            "linkedin":        "",
            "summary":         f"Experienced professional targeting the role of {job_role}.",
            "skills":          matched_skills + missing_skills[:5],
            "experience":      [],
            "education":       [],
            "certifications":  [],
            "job_role":        job_role,
            "improvements_made": [
                "Professional summary updated for target role",
                "Missing keywords added to skills section",
            ],
        }