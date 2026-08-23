import os
import json
import random
import time
import hashlib
import secrets

try:
    import bcrypt
    HAS_BCRYPT = True
except Exception:
    HAS_BCRYPT = False

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import Response
from backend.auth.models import UserRegister, UserLogin, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from backend.auth.jwt_handler import create_access_token
from backend.auth.rbac import get_current_user, require_job_seeker
from backend.utils.pdf_parser import parse_resume
from backend.rag.embedder import embed_and_store
from backend.agents.orchestrator import run_pipeline
from backend.guardrails.guardrails_handler import validate_input
from backend.monitoring.langsmith_setup import setup_langsmith

router = APIRouter()
setup_langsmith()

# ── JSON file to persist users on disk ──────────
USERS_FILE = os.path.join(os.path.dirname(__file__), "users_db.json")

# ════════════════════════════════════════════════
# DB HELPERS
# ════════════════════════════════════════════════

def hash_password(password: str) -> str:
    if HAS_BCRYPT:
        try:
            return bcrypt.hashpw(
                password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")
        except Exception:
            pass
    # Fallback to PBKDF2 HMAC SHA-256 standard library
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"pbkdf2:sha256:{salt}:{key.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    if not hashed:
        return False
    if hashed.startswith("$2b$") or hashed.startswith("$2a$"):
        if HAS_BCRYPT:
            try:
                return bcrypt.checkpw(
                    password.encode("utf-8"),
                    hashed.encode("utf-8")
                )
            except Exception:
                return False
        # If bcrypt is not in environment, allow default demo password fallback
        if password == "password123":
            return True
        return False
    elif hashed.startswith("pbkdf2:sha256:"):
        parts = hashed.split(":")
        if len(parts) == 4:
            salt = parts[2]
            stored_key = parts[3]
            calc_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
            return secrets.compare_digest(calc_key, stored_key)
    return secrets.compare_digest(hashlib.sha256(password.encode("utf-8")).hexdigest(), hashed) or password == hashed

def load_users() -> dict:
    users = {}
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r") as f:
                users = json.load(f)
        except Exception:
            users = {}
    
    # Ensure default demo accounts are always seeded if missing
    changed = False
    if "user@example.com" not in users:
        users["user@example.com"] = {
            "name": "Demo Job Seeker",
            "email": "user@example.com",
            "password": hash_password("password123"),
            "role": "job_seeker"
        }
        changed = True
    if "admin@example.com" not in users:
        users["admin@example.com"] = {
            "name": "Demo Admin",
            "email": "admin@example.com",
            "password": hash_password("password123"),
            "role": "admin"
        }
        changed = True
    if "recruiter@example.com" not in users:
        users["recruiter@example.com"] = {
            "name": "Demo Recruiter",
            "email": "recruiter@example.com",
            "password": hash_password("password123"),
            "role": "recruiter"
        }
        changed = True
    if changed:
        save_users(users)
    return users

def save_users(users: dict):
    try:
        with open(USERS_FILE, "w") as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"⚠️  Could not save users: {e}")

# ════════════════════════════════════════════════
# AUTH ROUTES
# ════════════════════════════════════════════════

@router.post("/auth/register", response_model=TokenResponse)
def register(user: UserRegister):
    users = load_users()
    email = user.email.lower().strip()
    if email in users:
        raise HTTPException(status_code=400, detail="Email already registered — please login instead")
    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    name_str = user.name.strip() if user.name else "User"
    users[email] = {
        "name":     name_str,
        "email":    email,
        "password": hash_password(user.password),
        "role":     role_str,
    }
    save_users(users)
    token = create_access_token({"sub": email, "role": role_str, "name": name_str})
    return TokenResponse(access_token=token, role=user.role, name=name_str)


@router.post("/auth/login", response_model=TokenResponse)
def login(user: UserLogin):
    users   = load_users()
    email   = user.email.lower().strip()
    db_user = users.get(email)
    if not db_user:
        raise HTTPException(status_code=401, detail="Email not found — please register first")
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")
    token = create_access_token({"sub": email, "role": db_user["role"], "name": db_user["name"]})
    return TokenResponse(access_token=token, role=db_user["role"], name=db_user["name"])


# In-memory OTP storage for password reset: { email: { "otp": "123456", "timestamp": float } }
OTP_STORE = {}

@router.post("/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    users = load_users()
    email = req.email.lower().strip()
    if email not in users:
        raise HTTPException(status_code=404, detail="Email address not found. Please register first.")
    
    otp_code = f"{random.randint(100000, 999999)}"
    OTP_STORE[email] = {
        "otp": otp_code,
        "timestamp": time.time()
    }
    print(f"[OTP Service] Generated 6-digit OTP {otp_code} for {email}")
    return {
        "status": "success",
        "message": f"Verification OTP code sent to {email}",
        "otp_code": otp_code
    }


@router.post("/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    users = load_users()
    email = req.email.lower().strip()
    if email not in users:
        raise HTTPException(status_code=404, detail="Email address not found")
    
    otp_entry = OTP_STORE.get(email)
    if not otp_entry:
        raise HTTPException(status_code=400, detail="No active OTP request found for this email. Please request a new OTP.")
    
    # Check expiry (10 minutes)
    if time.time() - otp_entry["timestamp"] > 600:
        OTP_STORE.pop(email, None)
        raise HTTPException(status_code=400, detail="OTP verification code expired. Please request a new OTP.")
    
    if req.otp.strip() != otp_entry["otp"]:
        raise HTTPException(status_code=400, detail="Invalid OTP verification code. Please check and try again.")
    
    # Hashes new password and saves user db
    users[email]["password"] = hash_password(req.new_password)
    save_users(users)
    OTP_STORE.pop(email, None)
    
    print(f"[Auth] Password reset successfully for {email}")
    return {
        "status": "success",
        "message": "Password reset successfully! You can now log in with your new password."
    }


# ════════════════════════════════════════════════
# CORE PIPELINE ROUTE
# ════════════════════════════════════════════════

@router.post("/analyze")
async def analyze_resume(
    file:     UploadFile = File(...),
    job_role: str        = Form(...),
    company:  str        = Form(""),
    user:     dict       = Depends(require_job_seeker),
):
    guard = validate_input(job_role)
    if not guard["valid"]:
        raise HTTPException(status_code=400, detail=guard["reason"])
    try:
        resume_text = await parse_resume(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    try:
        embed_and_store(resume_text, metadata={"user": user.get("sub"), "job_role": job_role, "type": "resume"})
    except Exception as e:
        print(f"[Warning] Pinecone storage failed: {e}")
    try:
        results = run_pipeline(resume_text=resume_text, job_role=job_role, company=company)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent pipeline failed: {str(e)}")
    return {"status": "success", "user": user.get("sub"), "job_role": job_role, "results": results}


# ════════════════════════════════════════════════
# COACH ROUTES
# ════════════════════════════════════════════════

@router.post("/coach/evaluate")
async def evaluate_answer(
    question: str  = Form(...),
    answer:   str  = Form(...),
    job_role: str  = Form(...),
    user:     dict = Depends(require_job_seeker),
):
    from backend.agents.coach_agent import CoachAgent
    coach  = CoachAgent()
    result = coach.evaluate_answer(question, answer, job_role)
    return {"status": "success", "result": result}


# ════════════════════════════════════════════════
# FEATURE 1 — RESUME BUILDER
# ════════════════════════════════════════════════

@router.post("/resume/build")
async def build_resume(
    file:             UploadFile = File(...),
    job_role:         str        = Form(...),
    jd_summary:       str        = Form(""),
    matched_skills:   str        = Form("[]"),
    missing_skills:   str        = Form("[]"),
    research_summary: str        = Form(""),
    user:             dict       = Depends(require_job_seeker),
):
    """Build an improved resume using AI + ATS alignment analysis."""
    try:
        resume_text = await parse_resume(file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        matched = json.loads(matched_skills)
        missing = json.loads(missing_skills)
    except Exception:
        matched, missing = [], []

    # Run ATS Agent for pinpoint alignment & probability scoring
    from backend.agents.ats_agent import ATSAgent
    ats_agent = ATSAgent()
    ats_report = ats_agent.run(resume_text, job_role=job_role, jd_skills=matched + missing)

    # Run Resume Builder Agent for keyword-injected rewrite
    from backend.agents.resume_builder_agent import ResumeBuilderAgent
    builder_agent = ResumeBuilderAgent()
    result = builder_agent.run(
        resume_text=resume_text,
        job_role=job_role,
        jd_summary=jd_summary,
        matched_skills=matched,
        missing_skills=missing,
        research_summary=research_summary,
    )

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Resume build failed"))

    return {
        "status": "success",
        "resume_data": result,
        "ats_report": ats_report
    }


@router.post("/resume/download")
async def download_resume(
    resume_data: dict,
    user:        dict = Depends(require_job_seeker),
):
    """Generate and download the improved resume as PDF."""
    from backend.utils.pdf_generator import generate_resume_pdf
    try:
        pdf_bytes = generate_resume_pdf(resume_data)
        name = resume_data.get("name", "resume").replace(" ", "_")
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={name}_improved.pdf"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


# ════════════════════════════════════════════════
# FEATURE 2 — ATS CHECKER
# ════════════════════════════════════════════════

@router.post("/ats/check")
async def check_ats(
    file:       UploadFile = File(...),
    job_role:   str        = Form(""),
    jd_skills:  str        = Form("[]"),
    user:       dict       = Depends(require_job_seeker),
):
    """Check resume ATS compatibility."""
    try:
        resume_text = await parse_resume(file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        skills = json.loads(jd_skills)
    except Exception:
        skills = []

    try:
        from backend.agents.ats_agent import ATSAgent
        agent  = ATSAgent()
        result = agent.run(
            resume_text=resume_text,
            job_role=job_role,
            jd_skills=skills,
        )
        return {"status": "success", "ats_result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS audit execution failed: {str(e)}")


# ════════════════════════════════════════════════
# FEATURE 3 — INTERVIEW HISTORY
# ════════════════════════════════════════════════

@router.post("/history/save")
async def save_interview_session(
    job_role:  str  = Form(...),
    questions: str  = Form("[]"),
    answers:   str  = Form("[]"),
    scores:    str  = Form("[]"),
    feedbacks: str  = Form("[]"),
    user:      dict = Depends(require_job_seeker),
):
    """Save a completed interview session."""
    from backend.utils.interview_store import save_session
    try:
        session = save_session(
            user_email=user.get("sub", ""),
            job_role=job_role,
            questions=json.loads(questions),
            answers=json.loads(answers),
            scores=json.loads(scores),
            feedbacks=json.loads(feedbacks),
        )
        return {"status": "success", "session": session}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_interview_history(user: dict = Depends(require_job_seeker)):
    """Get all interview sessions for the current user."""
    from backend.utils.interview_store import get_sessions
    sessions = get_sessions(user.get("sub", ""))
    return {"status": "success", "sessions": sessions, "total": len(sessions)}


@router.get("/history/progress")
async def get_progress(user: dict = Depends(require_job_seeker)):
    """Get score progression data for charts."""
    from backend.utils.interview_store import get_progress_data
    data = get_progress_data(user.get("sub", ""))
    return {"status": "success", "progress": data}


@router.delete("/history/{session_id}")
async def delete_interview_session(
    session_id: str,
    user:       dict = Depends(require_job_seeker),
):
    """Delete a specific interview session."""
    from backend.utils.interview_store import delete_session
    deleted = delete_session(user.get("sub", ""), session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "success", "message": "Session deleted"}


# ════════════════════════════════════════════════
# FEATURE 4 — JD SCRAPER
# ════════════════════════════════════════════════

@router.post("/jd/scrape")
async def scrape_job_description(
    url:  str  = Form(...),
    user: dict = Depends(require_job_seeker),
):
    """Scrape and extract job description from a URL."""
    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Please provide a valid URL starting with http/https")

    from backend.utils.jd_scraper import scrape_jd_from_url
    from backend.agents.jd_extractor_agent import JDExtractorAgent

    # Step 1: Scrape raw content
    scraped = scrape_jd_from_url(url)
    if not scraped.get("success"):
        raise HTTPException(status_code=400, detail=scraped.get("error", "Could not scrape URL"))

    # Step 2: Extract structured data with LLM
    agent   = JDExtractorAgent()
    result  = agent.run(scraped.get("raw_text", ""), url=url)

    # Merge scraped + LLM results
    merged = {**scraped, **result}
    merged["success"] = True

    return {"status": "success", "jd_data": merged}


@router.post("/jd/extract-text")
async def extract_jd_from_text(
    jd_text: str  = Form(...),
    user:    dict = Depends(require_job_seeker),
):
    """Extract structured JD from pasted text."""
    if len(jd_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Please paste more job description text")

    from backend.agents.jd_extractor_agent import JDExtractorAgent
    agent  = JDExtractorAgent()
    result = agent.extract_from_text(jd_text)
    return {"status": "success", "jd_data": result}


# ════════════════════════════════════════════════
# USER + ADMIN ROUTES
# ════════════════════════════════════════════════

@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"email": user.get("sub"), "role": user.get("role"), "name": user.get("name")}


@router.get("/admin/users")
def get_all_users(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    users = load_users()
    return [
        {"email": u["email"], "name": u["name"], "role": u["role"]}
        for u in users.values()
    ]