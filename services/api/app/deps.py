# services/api/app/deps.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import google.auth.transport.requests
import google.oauth2.id_token

from database import SessionLocal
from config import settings


# ------------- Banco de dados -------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------- Autenticação Firebase -------------
security = HTTPBearer(auto_error=False)

def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Dependência que extrai o token Firebase do header Authorization: Bearer <token>
    e verifica validade e claims (role/email verificado). 
    Lança 401 ou 403 em caso de falha.
    """
    print("[DEBUG] Verifying Firebase token")
    print(credentials)
    if not credentials or not credentials.scheme.lower() == "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação faltando ou inválido",
        )
    token = credentials.credentials
    print("[DEBUG] Token:", token)

    try:
        # Verifica no Google os tokens <https://firebase.google.com/docs/auth/admin/verify-id-tokens>
        request = google.auth.transport.requests.Request()
        decoded = google.oauth2.id_token.verify_firebase_token(token, request, settings.FIREBASE_PROJECT_ID)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    # Verifica se e-mail está verificado
    if not decoded.get("email_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="E-mail não verificado",
        )

    # Verifica se existe claim “role” e se é admin ou editor
    role = decoded.get("role")
    if role not in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissão insuficiente",
        )

    # Se tudo ok, devolve o objeto decodificado (pode conter email, uid, role, etc.)
    return decoded
