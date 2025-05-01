import os
import requests
from fastapi import HTTPException
from datetime import datetime, timedelta
import jwt

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
INTERNAL_SECRET = os.getenv("INTERNAL_SECRET", "dev-secret")
ALLOWED_STUDENT_DOMAIN = "alunos.ualg.pt"
ALLOWED_STAFF_DOMAIN = "ualg.pt"

def verify_google_token(id_token: str) -> dict:
    response = requests.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": id_token}
    )
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")

    payload = response.json()

    if payload.get("aud") != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Invalid client ID")

    email = payload.get("email", "")
    if email.endswith(ALLOWED_STUDENT_DOMAIN):
        role = "student"
    elif email.endswith(ALLOWED_STAFF_DOMAIN):
        role = "staff"
    else:
        raise HTTPException(status_code=403, detail="Unauthorized domain")

    return {"email": email, "role": role}

def create_internal_token(user_info: dict) -> str:
    payload = {
        "sub": user_info["email"],
        "role": user_info["role"],
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, INTERNAL_SECRET, algorithm="HS256")

def decode_internal_token(token: str) -> dict:
    try:
        return jwt.decode(token, INTERNAL_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
