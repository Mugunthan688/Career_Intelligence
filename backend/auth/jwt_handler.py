import json
import base64
import hmac
import hashlib
import time
from datetime import datetime, timedelta, timezone
from typing import Any, cast

try:
    from jose import JWTError, jwt  # type: ignore
except Exception:
    try:
        import jwt  # type: ignore
        JWTError = Exception  # type: ignore
    except Exception:
        jwt = None
        JWTError = Exception

from backend.config import settings

def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def _b64url_decode(s: str) -> bytes:
    pad = 4 - (len(s) % 4)
    if pad != 4:
        s += '=' * pad
    return base64.urlsafe_b64decode(s.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire_dt = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    exp_ts = int(expire_dt.timestamp())
    to_encode.update({"exp": exp_ts})

    if jwt is not None:
        try:
            token = jwt.encode(  # type: ignore
                to_encode,
                settings.SECRET_KEY,
                algorithm=settings.ALGORITHM
            )
            return str(token)
        except Exception:
            pass

    # Built-in Standard Library HS256 JWT encoding fallback
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _b64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _b64url_encode(json.dumps(to_encode, separators=(',', ':')).encode('utf-8'))
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64url_encode(sig)
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_token(token: str) -> dict[str, Any] | None:
    if not token or not isinstance(token, str):
        return None

    if jwt is not None:
        try:
            payload = jwt.decode(  # type: ignore
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            if isinstance(payload, dict):
                return cast(dict[str, Any], payload)
        except Exception:
            pass

    # Built-in Standard Library HS256 JWT decoding fallback
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_bytes = _b64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        if isinstance(payload, dict):
            # Check expiration
            exp = payload.get('exp')
            if exp and isinstance(exp, (int, float)) and time.time() > exp:
                return None
            return cast(dict[str, Any], payload)
        return None
    except Exception:
        return None