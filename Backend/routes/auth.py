from flask import Blueprint, request, jsonify
from db import users_col, profiles_col
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)

# Helper to convert MongoDB object to JSON serializable
def user_to_json(user):
    if not user: return None
    user["user_id"] = str(user["_id"])
    del user["_id"]
    del user["password"]
    return user

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
    if users_col.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 409

    # ✅ Create user
    user_data = {
        "name": data["name"],
        "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "role": data["role"],
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

    user = users_col.find_one({"email": data["email"]})

    if user and check_password_hash(user["password"], data["password"]):
        return jsonify({
            "message": "Login successful",
            "user_id": str(user["_id"]),
            "name": user["name"],
            "role": user["role"]
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401