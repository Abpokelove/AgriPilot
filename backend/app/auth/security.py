import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from typing import Any, Dict, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config.logging_config import logger
from app.repository.db import repo


bearer_scheme = HTTPBearer(auto_error=False)
JWT_SECRET = os.getenv("JWT_SECRET", "dev-only-change-me")
JWT_EXPIRES_IN_SECONDS = int(os.getenv("JWT_EXPIRES_IN", "604800"))


def _b64url_encode(payload: bytes) -> str:
    return base64.urlsafe_b64encode(payload).rstrip(b"=").decode("utf-8")


def _b64url_decode(token_part: str) -> bytes:
    padding = "=" * (-len(token_part) % 4)
    return base64.urlsafe_b64decode(token_part + padding)


def hash_password(password: str, salt: Optional[bytes] = None) -> str:
    password_salt = salt or secrets.token_bytes(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        password_salt,
        200_000,
    )
    return f"pbkdf2_sha256${_b64url_encode(password_salt)}${_b64url_encode(password_hash)}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, salt_text, hash_text = stored_hash.split("$", 2)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = _b64url_decode(salt_text)
        expected_hash = _b64url_decode(hash_text)
        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            200_000,
        )
        return hmac.compare_digest(actual_hash, expected_hash)
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    issued_at = int(time.time())
    payload = {
        "sub": user_id,
        "email": email,
        "iat": issued_at,
        "exp": issued_at + JWT_EXPIRES_IN_SECONDS,
        "iss": "agripilot",
    }
    header = {"alg": "HS256", "typ": "JWT"}
    header_part = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_part = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_part}.{payload_part}".encode("utf-8")
    signature = hmac.new(JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_part}.{payload_part}.{_b64url_encode(signature)}"


def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        header_part, payload_part, signature_part = token.split(".")
        signing_input = f"{header_part}.{payload_part}".encode("utf-8")
        expected_signature = hmac.new(
            JWT_SECRET.encode("utf-8"),
            signing_input,
            hashlib.sha256,
        ).digest()
        actual_signature = _b64url_decode(signature_part)
        if not hmac.compare_digest(expected_signature, actual_signature):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

        payload = json.loads(_b64url_decode(payload_part))
        if int(payload.get("exp", 0)) < int(time.time()):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
        return payload
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Dict[str, Any]:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing access token")

    payload = decode_access_token(credentials.credentials)
    user = repo.get_user_by_id(payload.get("sub", ""))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authenticated user not found")
    return user


def user_public_profile(user: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": user["id"],
        "fullName": user["fullName"],
        "mobileNumber": user["mobileNumber"],
        "email": user["email"],
        "location": user["location"],
        "primaryCrop": user["primaryCrop"],
        "avatarSeed": (user.get("fullName", "AP")[:2] or "AP").upper(),
        "createdAt": user["createdAt"],
    }


def issue_session(user: Dict[str, Any]) -> Dict[str, Any]:
    token = create_access_token(user["id"], user["email"])
    return {
        "accessToken": token,
        "tokenType": "bearer",
        "user": user_public_profile(user),
    }

