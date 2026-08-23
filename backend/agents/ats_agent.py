"""
ats_agent.py
Checks resume compatibility with Applicant Tracking Systems (ATS).
Scores keyword density, formatting, file structure and gives
actionable fixes for each issue found.
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


# ── ATS formatting red flags ──────────────────────
ATS_RED_FLAGS = {
    "tables":       r'\|.+\|',
    "columns":      r'\t.+\t',
    "special_chars":r'[★☆✓✔●◆▶►■□✦✧]',
    "graphics":     r'\[image\]|\[photo\]|\[logo\]',
    "headers_footers": r'(page \d+|header|footer)',
}

# ── Must-have ATS sections ────────────────────────
REQUIRED_SECTIONS = [
    "experience", "education", "skills",
    "summary", "contact",
]

# ── Common ATS-friendly keywords by category ──────
ATS_KEYWORDS = {
    "ai_ml": [
        "python", "pytorch", "tensorflow", "scikit-learn",
        "langchain", "langgraph", "rag", "fine-tuning",
        "pinecone", "transformers", "llm", "groq",
        "embeddings", "vector database", "huggingface",
    ],
    "backend": [
        "fastapi", "django", "flask", "postgresql",
        "redis", "docker", "kubernetes", "rest api",
        "graphql", "microservices", "jwt", "oauth",
        "celery", "rabbitmq", "aws", "ci/cd",
    ],
    "general_tech": [
        "git", "linux", "agile", "scrum", "unit testing",
        "system design", "performance optimization", "debugging",
    ],
    "action_verbs": [
        "achieved", "built", "created", "delivered", "designed",
        "developed", "implemented", "improved", "led", "managed",
        "optimised", "reduced", "increased", "launched", "streamlined",
    ],
    "metrics_words": [
        "%", "percent", "million", "thousand", "revenue", "growth",
        "reduced", "increased", "saved", "users", "customers",
    ],
}


class ATSAgent:
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

    def run(self, resume_text: str, job_role: str = "", jd_skills: list | None = None) -> dict:
        jd_skills = jd_skills or []
        """
        Full ATS compatibility check.

        Returns:
            ats_score (0-100), keyword_score, format_score,
            section_score, issues (list), fixes (list),
            keyword_analysis, passed_checks, failed_checks
        """
        print("[ATS Agent] running...")

        jd_skills = jd_skills or []

        # ── Run rule-based checks first ───────────
        format_issues  = self._check_formatting(resume_text)
        section_issues = self._check_sections(resume_text)
        keyword_data   = self._check_keywords(resume_text, jd_skills, job_role)

        # ── Calculate sub-scores ──────────────────
        format_score  = max(0, 100 - (len(format_issues)  * 15))
        section_score = max(0, 100 - (len(section_issues) * 12))
        keyword_score = keyword_data["keyword_score"]

        # ── LLM deep analysis ─────────────────────
        llm_analysis = self._llm_analysis(resume_text, job_role, jd_skills)

        # ── Combine scores ────────────────────────
        ats_score = round(
            (format_score  * 0.25) +
            (section_score * 0.25) +
            (keyword_score * 0.30) +
            (llm_analysis.get("content_score", 70) * 0.20)
        )

        # ── Merge all issues ──────────────────────
        all_issues = format_issues + section_issues + llm_analysis.get("issues", [])
        all_fixes  = llm_analysis.get("fixes", []) + self._generate_fixes(format_issues + section_issues)

        # ── Passed vs failed checks ───────────────
        passed = []
        failed = []

        checks = {
            "Contact info present":        "contact"     in resume_text.lower(),
            "Experience section found":    "experience"  in resume_text.lower(),
            "Education section found":     "education"   in resume_text.lower(),
            "Skills section found":        "skill"       in resume_text.lower(),
            "Action verbs used":           any(v in resume_text.lower() for v in ATS_KEYWORDS["action_verbs"]),
            "Metrics/numbers present":     any(m in resume_text.lower() for m in ATS_KEYWORDS["metrics_words"]),
            "No special characters":       not any(re.search(p, resume_text) for p in [ATS_RED_FLAGS["special_chars"]]),
            "No table formatting":         not re.search(ATS_RED_FLAGS["tables"], resume_text),
            "Sufficient length":           len(resume_text.split()) >= 200,
            "Not overly long":             len(resume_text.split()) <= 1200,
            "Job role keywords present":   keyword_score >= 50,
        }

        for check, passed_flag in checks.items():
            if passed_flag:
                passed.append(check)
            else:
                failed.append(check)

        print(f"[ATS Agent] Score: {ats_score}/100")

        return {
            "success":          True,
            "ats_score":        ats_score,
            "format_score":     format_score,
            "section_score":    section_score,
            "keyword_score":    keyword_score,
            "content_score":    llm_analysis.get("content_score", 70),
            "issues":           all_issues[:10],
            "fixes":            all_fixes[:10],
            "passed_checks":    passed,
            "failed_checks":    failed,
            "keyword_analysis": keyword_data,
            "recommendation":   llm_analysis.get("recommendation", ""),
            "job_role":         job_role,
        }

    # ── Rule-based checks ─────────────────────────

    def _check_formatting(self, text: str) -> list:
        """Check for ATS-unfriendly formatting."""
        issues = []

        if re.search(ATS_RED_FLAGS["tables"], text):
            issues.append("Tables detected — ATS cannot parse table content")

        if re.search(ATS_RED_FLAGS["special_chars"], text):
            issues.append("Special characters (★ ● ✓) found — use plain bullets instead")

        if len(text.split()) < 200:
            issues.append("Resume too short — ATS expects at least 200 words")

        if len(text.split()) > 1200:
            issues.append("Resume too long — keep under 1200 words for ATS")

        lines = text.split('\n')
        very_long = [l for l in lines if len(l) > 200]
        if very_long:
            issues.append("Some lines are extremely long — break into bullet points")

        return issues

    def _check_sections(self, text: str) -> list:
        """Check for missing required sections."""
        issues = []
        text_lower = text.lower()

        section_map = {
            "Professional summary": ["summary", "objective", "profile", "about"],
            "Work experience":      ["experience", "employment", "work history"],
            "Education":            ["education", "degree", "university", "college"],
            "Skills":               ["skills", "technical skills", "competencies"],
            "Contact information":  ["email", "phone", "linkedin", "@"],
        }

        for section_name, keywords in section_map.items():
            if not any(kw in text_lower for kw in keywords):
                issues.append(f"{section_name} section not found or unclear")

        return issues

    def _check_keywords(self, text: str, jd_skills: list, job_role: str = "") -> dict:
        """Check keyword density and job-specific keyword presence."""
        text_lower = text.lower()

        # Action verb count
        action_verb_count = sum(
            1 for v in ATS_KEYWORDS["action_verbs"] if v in text_lower
        )

        # Metrics presence
        has_metrics = any(m in text_lower for m in ATS_KEYWORDS["metrics_words"])

        # Skill matching & domain keyword lookup
        domain_defaults = []
        role_lower = (job_role or "").lower()
        if "ai" in role_lower or "machine learning" in role_lower or "ml" in role_lower:
            domain_defaults = ["PyTorch", "TensorFlow", "Transformers", "RAG Pipelines", "LLMs", "Vector Databases", "Pinecone", "CUDA", "Quantization", "Fine-Tuning", "Python", "FastAPI", "Docker", "Model Evaluation"]
        elif "react" in role_lower or "frontend" in role_lower or "web" in role_lower:
            domain_defaults = ["React", "TypeScript", "Next.js", "Redux Toolkit", "Tailwind CSS", "Web Vitals", "Custom Hooks", "SSR", "GraphQL", "Jest", "Vite", "REST APIs"]
        elif "backend" in role_lower or "devops" in role_lower or "system" in role_lower:
            domain_defaults = ["Python", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "Microservices", "CI/CD", "AWS", "gRPC", "Kafka", "SQL Tuning"]
        elif "data" in role_lower or "analyst" in role_lower:
            domain_defaults = ["Python", "SQL", "Pandas", "Scikit-Learn", "Data Visualization", "Hypothesis Testing", "A/B Testing", "Machine Learning", "BigQuery", "Tableau"]
        elif "finance" in role_lower or "account" in role_lower:
            domain_defaults = ["Financial Modeling", "DCF Valuation", "Ratio Analysis", "Excel Pivot", "Balance Sheet", "Audit Compliance", "GAAP", "Forecasting", "Cash Flow"]
        else:
            domain_defaults = ["System Architecture", "API Integration", "Performance Optimization", "Agile Workflow", "Unit Testing", "CI/CD", "Data Security"]

        skills_to_check = list(set(list(jd_skills) + domain_defaults))

        matched_jd = [s for s in skills_to_check if s.lower() in text_lower]
        missing_jd = [s for s in skills_to_check if s.lower() not in text_lower]
        jd_match_pct = (len(matched_jd) / max(1, len(skills_to_check))) * 100

        keyword_score = min(100, round(
            (min(action_verb_count, 8) / 8 * 30) +
            (20 if has_metrics else 0) +
            (jd_match_pct * 0.50)
        ))

        suggested_impact = [
            "Architected", "Engineered", "Spearheaded", "Optimized", "Orchestrated", "Quantified", "Deployed", "Streamlined"
        ] + missing_jd[:6]

        return {
            "keyword_score":             keyword_score,
            "action_verb_count":         action_verb_count,
            "has_metrics":               has_metrics,
            "jd_skills_found":           matched_jd,
            "jd_skills_missing":         missing_jd,
            "jd_match_percent":          round(jd_match_pct),
            "suggested_impact_keywords": list(dict.fromkeys(suggested_impact)),
        }

    def _llm_analysis(self, resume_text: str, job_role: str, jd_skills: list) -> dict:
        """LLM-powered deep content analysis."""
        prompt = f"""
You are an expert, highly objective ATS (Applicant Tracking System) Specialist.

Audit this candidate's resume for strict ATS compatibility and relevance to the target job.

TARGET JOB ROLE: {job_role or "General Tech Roles"}
REQUIRED SKILLS: {", ".join(jd_skills[:15]) if jd_skills else "Target role " + (job_role or "General")}

RESUME TEXT SAMPLE:
{resume_text[:2500]}

SCORING RULES:
- Evaluate whether this candidate actually fits the target role ({job_role}).
- If the resume is IRRELEVANT or mismatched (e.g., Accountant applying for React Engineer), content_score MUST be low (15-35%).
- If the resume is relevant with solid achievements and clear structure, score 75-95%.

Respond ONLY in this exact JSON:
{{
    "content_score": <number 0-100>,
    "issues": [
        "<specific ATS issue 1>",
        "<specific ATS issue 2>"
    ],
    "fixes": [
        "<actionable fix 1>",
        "<actionable fix 2>"
    ],
    "recommendation": "<2 sentence recruiter recommendation>"
}}
"""
        try:
            response = self.llm.invoke(prompt)
            clean    = re.sub(r"```json|```", "", str(response.content)).strip()
            return json.loads(clean)
        except Exception:
            return {
                "content_score":  40,
                "issues":         ["Resume lacks clear domain keywords for target role"],
                "fixes":          ["Align experience bullet points with target job requirements"],
                "recommendation": "Review resume to ensure technical experience directly matches target job description.",
            }

    def _generate_fixes(self, issues: list) -> list:
        """Generate rule-based fixes for detected issues."""
        fix_map = {
            "table":         "Replace tables with simple bullet points",
            "special char":  "Replace ★ ● ✓ with plain dashes or bullet points (•)",
            "too short":     "Add more detail to your experience section — aim for 300-600 words",
            "too long":      "Trim to 1 page for <5 years experience, 2 pages for senior roles",
            "summary":       "Add a 3-4 line professional summary at the top",
            "experience":    "Add a clear 'Experience' or 'Work History' section",
            "education":     "Add an 'Education' section with degree and institution",
            "skills":        "Add a dedicated 'Skills' section with comma-separated skills",
            "contact":       "Add email and phone number at the top of the resume",
        }

        fixes = []
        for issue in issues:
            issue_lower = issue.lower()
            for key, fix in fix_map.items():
                if key in issue_lower:
                    fixes.append(fix)
                    break

        return fixes