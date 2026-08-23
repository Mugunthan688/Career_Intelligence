"""
jd_scraper.py
Scrapes job descriptions from LinkedIn, Indeed, Naukri and other
job board URLs using Tavily search + direct content extraction.
"""

import re
try:
    from tavily import TavilyClient
except Exception:
    TavilyClient = None

from backend.config import settings


# ── Common JD section keywords ───────────────────
JD_SECTIONS = [
    "responsibilities", "requirements", "qualifications",
    "skills", "experience", "about the role", "what you'll do",
    "what we're looking for", "nice to have", "benefits",
]


def scrape_jd_from_url(url: str) -> dict:
    """
    Scrape and extract structured job description from a URL.
    Returns a dict with role, company, skills, requirements, raw_text.
    """
    client = TavilyClient(api_key=settings.TAVILY_API_KEY)

    try:
        # ── Use Tavily to extract content from URL ───
        result = client.extract(urls=[url])

        raw_text = ""
        if result and result.get("results"):
            raw_text = result["results"][0].get("raw_content", "")

        if not raw_text:
            # Fallback: search for the job posting content
            search_result = client.search(
                query=f"job description site:{_extract_domain(url)}",
                max_results=3,
                include_raw_content=True,
            )
            for r in search_result.get("results", []):
                if url in r.get("url", ""):
                    raw_text = r.get("raw_content", r.get("content", ""))
                    break

        if not raw_text:
            return {
                "success":      False,
                "error":        "Could not extract content from this URL",
                "raw_text":     "",
                "job_role":     "",
                "company":      "",
                "skills":       [],
                "requirements": [],
            }

        # ── Parse the extracted text ─────────────────
        parsed = _parse_jd_text(raw_text, url)
        parsed["success"]  = True
        parsed["raw_text"] = raw_text[:3000]   # limit stored raw text

        return parsed

    except Exception as e:
        return {
            "success":      False,
            "error":        str(e),
            "raw_text":     "",
            "job_role":     "",
            "company":      "",
            "skills":       [],
            "requirements": [],
        }


def _extract_domain(url: str) -> str:
    """Extract domain from URL."""
    match = re.search(r'(?:https?://)?(?:www\.)?([^/]+)', url)
    return match.group(1) if match else ""


def _parse_jd_text(text: str, url: str) -> dict:
    """
    Parse raw JD text to extract structured fields.
    """
    lines = [l.strip() for l in text.split('\n') if l.strip()]

    # ── Detect job role (usually in first few lines) ─
    job_role = ""
    company  = ""

    for line in lines[:15]:
        # Skip very short or very long lines
        if 5 < len(line) < 80:
            if not job_role and any(kw in line.lower() for kw in [
                "engineer", "developer", "manager", "analyst",
                "designer", "scientist", "lead", "architect",
                "consultant", "specialist", "intern",
            ]):
                job_role = line.strip()
            elif not company and any(kw in line.lower() for kw in [
                "at ", "company", "inc", "ltd", "technologies",
                "solutions", "services", "corp",
            ]):
                company = line.strip()

    # ── Extract skills ────────────────────────────
    TECH_SKILLS = [
        "python", "java", "javascript", "typescript", "react", "angular",
        "vue", "node", "nodejs", "django", "fastapi", "flask", "spring",
        "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
        "git", "github", "ci/cd", "jenkins", "graphql", "rest", "api",
        "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
        "html", "css", "tailwind", "sass", "figma", "agile", "scrum",
        "linux", "bash", "go", "rust", "c++", "c#", "swift", "kotlin",
    ]

    text_lower = text.lower()
    found_skills = [s for s in TECH_SKILLS if s in text_lower]

    # ── Extract requirements (bullet points) ─────
    requirements = []
    in_req_section = False

    for line in lines:
        line_lower = line.lower()

        # Detect requirement sections
        if any(kw in line_lower for kw in ["requirement", "qualification", "you will", "what we"]):
            in_req_section = True
            continue

        # Stop at benefits/perks sections
        if any(kw in line_lower for kw in ["benefit", "perk", "we offer", "compensation"]):
            in_req_section = False

        if in_req_section and len(line) > 20:
            # Clean bullet characters
            clean = re.sub(r'^[•\-\*\–\—▪►→✓✔\d+\.\)]+\s*', '', line).strip()
            if clean and len(clean) > 15:
                requirements.append(clean)

        if len(requirements) >= 10:
            break

    # ── Detect source platform ────────────────────
    source = "Unknown"
    if "linkedin" in url:    source = "LinkedIn"
    elif "indeed"  in url:   source = "Indeed"
    elif "naukri"  in url:   source = "Naukri"
    elif "glassdoor" in url: source = "Glassdoor"
    elif "monster" in url:   source = "Monster"

    return {
        "job_role":     job_role,
        "company":      company,
        "skills":       found_skills[:20],
        "requirements": requirements[:10],
        "source":       source,
        "url":          url,
    }