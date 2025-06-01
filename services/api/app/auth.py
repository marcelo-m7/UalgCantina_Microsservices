# api/auth.py
import os
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Inicializar o Firebase Admin SDK
# Carregar credenciais do arquivo JSON ou variáveis de ambiente
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if cred_path:
    cred = credentials.Certificate
else:
    # Use default credentials if the path is not set (e.g., running on Cloud Run, App Engine, etc.)
    cred = credentials.ApplicationDefault()

# Inicializar o app Firebase se ele ainda não foi inicializado
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Dependency to get the Firebase ID token from the Authorization header
oauth2_scheme = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    try:
        token_string = credentials.credentials
        decoded_token = firebase_auth.verify_id_token(token_string)
        # Optional: Check if email is verified and user has a valid role claim
        # if not decoded_token.get('email_verified') or decoded_token.get('role') not in ['admin', 'editor']:
        #     raise HTTPException(status_code=403, detail="Insufficient permissions")
        return decoded_token
    except (ValueError, firebase_auth.InvalidIdTokenError):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")