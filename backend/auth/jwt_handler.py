from datetime import datetime, timedelta, timezone
from typing import Any, cast
try:
    from jose import JWTError, jwt  # type: ignore
except Exception:
    import jwt  # type: ignore
    JWTError = Exception  # type: ignore

from backend.config import settings

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    token = jwt.encode(  # type: ignore
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return str(token)

def verify_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(  # type: ignore
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        if isinstance(payload, dict):
            return cast(dict[str, Any], payload)
        return None
    except Exception:
        return None