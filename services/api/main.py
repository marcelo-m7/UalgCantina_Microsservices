from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_session
from auth import (
    verify_google_token,
    create_internal_token,
    decode_internal_token,
    exchange_code_for_token
)
from urllib.parse import urlencode, quote
import os

app = FastAPI()

# ---------------------
# CORS Middleware (para desenvolvimento)
# ---------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------
# Configuração
# ---------------------
DEFAULT_REDIRECT = "http://localhost:5000/"
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


# ---------------------
# Dependência para autenticação
# ---------------------
def get_current_user(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ", 1)[1]
    return decode_internal_token(token)


# ---------------------
# Health Check
# ---------------------
@app.get("/health")
def health_check():
    return {"status": "ok"}


# ---------------------
# Ementa Semanal
# ---------------------
@app.get("/week")
def get_weekly_menu(session: Session = Depends(get_session)):
    result = session.execute(text("""
        SELECT e.data, p.designacao 
        FROM Ementas e
        JOIN EmentaPrato ep ON e.id = ep.ementa_id
        JOIN Pratos p ON ep.prato_id = p.id
        ORDER BY e.data
    """)).fetchall()
    return [{"data": str(row[0]), "prato": row[1]} for row in result]


# ---------------------
# Login direto com id_token do frontend
# ---------------------
@app.post("/login")
def login(id_token: str):
    user_info = verify_google_token(id_token)
    jwt_token = create_internal_token(user_info)
    return {"access_token": jwt_token, "role": user_info["role"]}


# ---------------------
# Info do Usuário Atual
# ---------------------
@app.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"email": user["sub"], "role": user["role"]}


# ---------------------
# Início do login via navegador com redirecionamento
# ---------------------
@app.get("/login")
def google_login(redirect: str = DEFAULT_REDIRECT):
    params = urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": "http://localhost:8000/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": redirect  # redirecionamento original
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


# ---------------------
# Callback do Google OAuth 2.0 (troca de código por id_token)
# ---------------------
@app.get("/callback")
def google_callback(code: str, state: str = DEFAULT_REDIRECT):
    try:
        id_token = exchange_code_for_token(code)
        user_info = verify_google_token(id_token)
        jwt_token = create_internal_token(user_info)
        return RedirectResponse(f"{state}?token={quote(jwt_token)}")
    except HTTPException as e:
        return RedirectResponse(f"{state}?error={e.detail}")
