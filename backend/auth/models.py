from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional

# ── 3 User Roles ────────────────────────────────
class UserRole(str, Enum):
    JOB_SEEKER = "job_seeker"
    RECRUITER = "recruiter"
    ADMIN = "admin"

# ── User Schemas ────────────────────────────────
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole = UserRole.JOB_SEEKER

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    name: str
    email: str
    role: UserRole

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    name: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

class CoachEvaluateRequest(BaseModel):
    question: str
    user_answer: Optional[str] = None
    answer: Optional[str] = None
    job_role: Optional[str] = "General"

class JDExtractRequest(BaseModel):
    url: Optional[str] = None
    text: Optional[str] = None