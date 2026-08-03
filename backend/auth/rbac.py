from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from backend.auth.jwt_handler import verify_token
from backend.auth.models import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ── Get Current User ────────────────────────────
def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return payload

# ── Role Guards ─────────────────────────────────
def require_job_seeker(user=Depends(get_current_user)):
    if user.get("role") not in [UserRole.JOB_SEEKER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Access denied")
    return user

def require_recruiter(user=Depends(get_current_user)):
    if user.get("role") not in [UserRole.RECRUITER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Access denied")
    return user

def require_admin(user=Depends(get_current_user)):
    if user.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin only")
    return user