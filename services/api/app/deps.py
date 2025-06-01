# deps.py
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import SessionLocal
import google.auth.transport.requests
import google.oauth2.id_token
from config import settings

CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
ISSUER = f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}"


def get_db():
    """
    Dependência que retorna uma sessão do SQLAlchemy.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_firebase_token(request: Request) -> dict:
    """
    Verifica o header Authorization: Bearer <token> usando o ID token do Firebase.
    Retorna o payload decodificado (claims) se válido. Caso contrário, levanta 401.
    """
    auth_header: str | None = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )

    token = auth_header.split(" ", 1)[1]
    try:
        request_adapter = google.auth.transport.requests.Request()
        decoded = google.oauth2.id_token.verify_firebase_token(
            token,
            request_adapter,
            audience=settings.FIREBASE_PROJECT_ID
        )
        if decoded.get("iss") != ISSUER:
            raise ValueError("Issuer inválido")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {e}"
        )

    return decoded


def get_current_user(claims: dict = Depends(verify_firebase_token)) -> dict:
    """
    Retorna o dicionário de claims (uid, email, custom claims do Firebase).
    Se precisar de controle de perfis, adicione aqui:
        role = claims.get("role"); verificar permissões etc.
    """
    return claims
