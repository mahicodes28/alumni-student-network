from flask import Blueprint, request, jsonify
from db import users_col, profiles_col
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from utils.auth_middleware import serializer
import requests
import os

auth_bp = Blueprint("auth", __name__)

# ================= REGISTER =================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # Validate input
    required_fields = ["name", "email", "password", "role"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    # Check if user already exists
    if users_col.find_one({"email": data["email"].lower()}):
        return jsonify({"error": "Email already registered"}), 409

    # Create user
    role = data.get("role", "student")
    status = "approved" if role == "student" else "pending"

    user_data = {
        "name": data["name"],
        "email": data["email"].lower(),
        "password": generate_password_hash(data["password"]),
        "role": role,
        "status": status,
        "createdAt": datetime.utcnow()
    }

    result = users_col.insert_one(user_data)
    user_id = result.inserted_id

    # ✅ Create empty profile for search visibility
    profiles_col.insert_one({
        "userId": user_id,
        "skills": "",
        "experience": "",
        "company": "",
        "career_goal": "",
        "interests": "",
        "bio": "",
        "education": ""
    })

    return jsonify({"message": "User registered successfully"}), 201


# ================= LOGIN =================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # ✅ Validate input
    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400

    email = data["email"].lower()
    user = users_col.find_one({"email": email})

    if user and check_password_hash(user["password"], data["password"]):
        token = serializer.dumps({
            "user_id": str(user["_id"]),
            "role": user["role"],
            "name": user["name"]
        })
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user_id": str(user["_id"]),
            "name": user["name"],
            "role": user["role"],
            "status": user.get("status", "approved")
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401


# ================= GOOGLE LOGIN =================
@auth_bp.route("/google-login", methods=["POST"])
def google_login():
    data = request.get_json()
    google_token = data.get("token")
    role = data.get("role", "student")

    if not google_token:
        return jsonify({"error": "Google ID token required"}), 400

    try:
        res = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={google_token}")
        if res.status_code != 200:
            return jsonify({"error": "Invalid Google token"}), 400
        
        token_info = res.json()
        
        configured_client_id = os.getenv("GOOGLE_CLIENT_ID")
        if configured_client_id and token_info.get("aud") != configured_client_id:
            return jsonify({"error": "Google token audience mismatch"}), 400
            
        email = token_info.get("email").lower()
        name = token_info.get("name")
        
    except Exception as e:
        return jsonify({"error": f"Failed to verify Google token: {str(e)}"}), 500

    user = users_col.find_one({"email": email})
    if not user:
        status = "approved" if role == "student" else "pending"
        user_data = {
            "name": name,
            "email": email,
            "role": role,
            "status": status,
            "createdAt": datetime.utcnow()
        }
        result = users_col.insert_one(user_data)
        user_id = result.inserted_id
        
        profiles_col.insert_one({
            "userId": user_id,
            "skills": "",
            "experience": "",
            "company": "",
            "career_goal": "",
            "interests": "",
            "bio": "",
            "education": ""
        })
        user = users_col.find_one({"_id": user_id})
    
    token = serializer.dumps({
        "user_id": str(user["_id"]),
        "role": user["role"],
        "name": user["name"]
    })
    
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user_id": str(user["_id"]),
        "name": user["name"],
        "role": user["role"],
        "status": user.get("status", "approved")
    }), 200


# ================= LINKEDIN LOGIN =================
@auth_bp.route("/linkedin-login", methods=["POST"])
def linkedin_login():
    data = request.get_json()
    code = data.get("code")
    role = data.get("role", "student")
    redirect_uri = data.get("redirectUri") or os.getenv("LINKEDIN_REDIRECT_URI")

    if not code:
        return jsonify({"error": "LinkedIn authorization code required"}), 400

    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")

    if not client_id or not client_secret:
        return jsonify({"error": "LinkedIn OAuth credentials not configured on backend"}), 500

    try:
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": client_id,
            "client_secret": client_secret
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        token_res = requests.post(token_url, data=payload, headers=headers)
        if token_res.status_code != 200:
            return jsonify({"error": "Failed to exchange LinkedIn code for token"}), 400
            
        access_token = token_res.json().get("access_token")

        userinfo_url = "https://api.linkedin.com/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_res = requests.get(userinfo_url, headers=headers)
        if userinfo_res.status_code != 200:
            return jsonify({"error": "Failed to fetch LinkedIn user info"}), 400
            
        user_info = userinfo_res.json()
        email = user_info.get("email").lower()
        name = f"{user_info.get('given_name', '')} {user_info.get('family_name', '')}".strip() or user_info.get("name")
        
    except Exception as e:
        return jsonify({"error": f"LinkedIn authentication failed: {str(e)}"}), 500

    user = users_col.find_one({"email": email})
    if not user:
        status = "approved" if role == "student" else "pending"
        user_data = {
            "name": name,
            "email": email,
            "role": role,
            "status": status,
            "createdAt": datetime.utcnow()
        }
        result = users_col.insert_one(user_data)
        user_id = result.inserted_id
        
        profiles_col.insert_one({
            "userId": user_id,
            "skills": "",
            "experience": "",
            "company": "",
            "career_goal": "",
            "interests": "",
            "bio": "",
            "education": ""
        })
        user = users_col.find_one({"_id": user_id})

    token = serializer.dumps({
        "user_id": str(user["_id"]),
        "role": user["role"],
        "name": user["name"]
    })

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user_id": str(user["_id"]),
        "name": user["name"],
        "role": user["role"],
        "status": user.get("status", "approved")
    }), 200