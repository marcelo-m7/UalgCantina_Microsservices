from flask import request, jsonify, g
from functools import wraps
from firebase_admin import auth as fb_auth
from models import User
from db import Session

def require_admin(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'detail': 'Missing token'}), 401
        try:
            decoded = fb_auth.verify_id_token(token)
            email = decoded['email']
        except Exception:
            return jsonify({'detail': 'Invalid token'}), 401
        db = Session()
        user = db.query(User).filter_by(email=email).first()
        if not user or user.role != 'admin':
            return jsonify({'detail': 'Forbidden'}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return wrapper