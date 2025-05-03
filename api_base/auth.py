import os
import requests
from fastapi import HTTPException
from datetime import datetime, timedelta
import jwt

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
INTERNAL_SECRET = os.getenv("INTERNAL_SECRET", "dev-secret")
ALLOWED_STUDENT_DOMAIN = []
ALLOWED_STAFF_DOMAIN = ["marcelosouzasantos77@gmail.com"]
REDIRECT_URI = "http://localhost:8000/callback"
ALGORITHM = "HS256"

def exchange_code_for_token(code: str) -> str:
    response = requests.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    })

    print("Google OAuth token response:", response.json())

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Failed to exchange code for token")

    id_token = response.json().get("id_token")
    if not id_token:
        raise HTTPException(status_code=401, detail="Missing id_token")

    return id_token

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
    domain = email
    
    if domain in ALLOWED_STAFF_DOMAIN:
        role = "staff"
    else:
        role = "student"

    return {"email": email, "role": role}

def create_internal_token(user_info: dict) -> str:
    payload = {
        "sub": user_info["email"],
        "role": user_info["role"],
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, INTERNAL_SECRET, algorithm=ALGORITHM)

def decode_internal_token(token: str) -> dict:
    try:
        return jwt.decode(token, INTERNAL_SECRET, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
