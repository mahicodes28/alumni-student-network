from flask import Blueprint, request, jsonify
from db import profiles_col, users_col
from bson import ObjectId

profile_bp = Blueprint("profile", __name__)

# ================= CREATE / UPDATE PROFILE =================
@profile_bp.route("/profile", methods=["POST"])
def create_profile():
    data = request.get_json()
    if "user_id" not in data:
        return jsonify({"error": "user_id is required"}), 400

    user_id = ObjectId(data["user_id"])
    
    update_data = {
        "skills": data.get("skills"),
        "interests": data.get("interests"),
        "career_goal": data.get("career_goal"),
        "company": data.get("company"),
        "experience": data.get("experience"),
        "bio": data.get("bio"),
        "education": data.get("education")
    }
    
    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}

    profiles_col.update_one(
        {"userId": user_id},
        {"$set": update_data},
        upsert=True
    )
    
    return jsonify({"message": "Profile saved"}), 200

@profile_bp.route("/profile/<user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json()
    u_id = ObjectId(user_id)

    update_data = {
        "skills": data.get("skills"),
        "interests": data.get("interests"),
        "career_goal": data.get("career_goal"),
        "company": data.get("company"),
        "experience": data.get("experience"),
        "bio": data.get("bio"),
        "education": data.get("education")
    }
    
    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}

    profiles_col.update_one(
        {"userId": u_id},
        {"$set": update_data},
        upsert=True
    )

    return jsonify({"message": "Profile updated successfully"}), 200


# ================= GET PROFILE =================
@profile_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    u_id = ObjectId(user_id)
    profile = profiles_col.find_one({"userId": u_id})

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "user_id": str(profile["userId"]),
        "skills": profile.get("skills", ""),
        "interests": profile.get("interests", ""),
        "career_goal": profile.get("career_goal", ""),
        "company": profile.get("company", ""),
        "experience": profile.get("experience", ""),
        "bio": profile.get("bio", ""),
        "education": profile.get("education", "")
    }), 200