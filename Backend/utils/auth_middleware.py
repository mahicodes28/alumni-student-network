import os
from functools import wraps
from flask import request, jsonify, g
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

# Get secret key from environment or use a secure fallback
SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY") or "alumni-student-connect-secret-key-xyz"
serializer = URLSafeTimedSerializer(SECRET_KEY)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        
        try:
            # Token valid for 7 days (604800 seconds)
            data = serializer.loads(token, max_age=604800)
            g.current_user = data
        except SignatureExpired:
            return jsonify({"error": "Session expired, please login again"}), 401
        except BadSignature:
            return jsonify({"error": "Invalid authentication token"}), 401
            
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
            
        try:
            data = serializer.loads(token, max_age=604800)
            if data.get("role") != "admin":
                return jsonify({"error": "Access forbidden: Admin privilege required"}), 403
            g.current_user = data
        except SignatureExpired:
            return jsonify({"error": "Session expired, please login again"}), 401
        except BadSignature:
            return jsonify({"error": "Invalid authentication token"}), 401
            
        return f(*args, **kwargs)
    return decorated
