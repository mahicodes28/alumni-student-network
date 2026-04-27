from flask import Blueprint, request, jsonify
from db import users_col, profiles_col
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

# ================= REGISTER =================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # ✅ Validate input
    required_fields = ["name", "email", "password", "role"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    # ✅ Check if user already exists
    if users_col.find_one({"email": data["email"].lower()}):
        return jsonify({"error": "Email already registered"}), 409

    # ✅ Create user
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
        return jsonify({
            "message": "Login successful",
            "user_id": str(user["_id"]),
            "name": user["name"],
            "role": user["role"],
            "status": user.get("status", "approved")
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401