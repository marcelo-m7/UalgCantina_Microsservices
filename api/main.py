from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_session
from auth import verify_google_token, create_internal_token, decode_internal_token
from urllib.parse import urlencode, quote
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Liberado para desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
DEFAULT_REDIRECT = "http://localhost:5000/token"  # URL do Flutter Web para receber o JWT


def get_current_user(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ", 1)[1]
    return decode_internal_token(token)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/week")
def get_weekly_menu(session: Session = Depends(get_session)):
    query = text("""
        SELECT e.data, p.designacao 
        FROM Ementas e
        JOIN EmentaPrato ep ON e.id = ep.ementa_id
        JOIN Pratos p ON ep.prato_id = p.id
        ORDER BY e.data
    """)
    result = session.execute(query).fetchall()
    return [{"data": str(row[0]), "prato": row[1]} for row in result]


@app.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"email": user["sub"], "role": user["role"]}


@app.get("/login")
def google_login(redirect: str = DEFAULT_REDIRECT):
    # Redireciona para a página de login do Google
    params = urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": "http://localhost:8000/callback",
        "response_type": "id_token",
        "scope": "openid email",
        "nonce": "secure_nonce",
        "prompt": "select_account",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@app.get("/callback")
def google_callback(request: Request, redirect: str = DEFAULT_REDIRECT):
    id_token = request.query_params.get("id_token")
    if not id_token:
        return RedirectResponse(f"{redirect}?error=missing_token")

    try:
        user_info = verify_google_token(id_token)
        jwt_token = create_internal_token(user_info)
        final_redirect = f"{redirect}?token={quote(jwt_token)}"
        return RedirectResponse(final_redirect)
    except HTTPException as e:
        return RedirectResponse(f"{redirect}?error={quote(e.detail)}")
