from flask import Blueprint, request, jsonify
from db import profiles_col, users_col

from bson import ObjectId
from datetime import datetime

profile_bp = Blueprint("profile", __name__)

# =========================================
# CREATE / UPDATE PROFILE
# =========================================
@profile_bp.route("/profile", methods=["POST"])
def create_profile():

    data = request.get_json()

    if "user_id" not in data:

        return jsonify({
            "error": "user_id is required"
        }), 400

    user_id = ObjectId(data["user_id"])

    update_data = {

        "skills": data.get("skills", ""),

        "interests": data.get("interests", ""),

        "career_goal": data.get("career_goal", ""),

        "company": data.get("company", ""),

        "experience": data.get("experience", ""),

        "bio": data.get("bio", ""),

        "education": data.get("education", ""),

        "domain": data.get("domain", ""),

        "linkedin": data.get("linkedin", ""),

        "github": data.get("github", ""),

        "portfolio": data.get("portfolio", ""),

        "achievements": data.get("achievements", ""),

        "availability": data.get(
            "availability",
            "Available for mentorship"
        ),

        "updatedAt": datetime.utcnow()

    }

    profiles_col.update_one(

        {"userId": user_id},

        {"$set": update_data},

        upsert=True

    )

    return jsonify({
        "message": "Profile saved successfully"
    }), 200


# =========================================
# UPDATE PROFILE
# =========================================
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

        "education": data.get("education"),

        "domain": data.get("domain"),

        "linkedin": data.get("linkedin"),

        "github": data.get("github"),

        "portfolio": data.get("portfolio"),

        "achievements": data.get("achievements"),

        "availability": data.get("availability"),

        "updatedAt": datetime.utcnow()

    }

    # REMOVE NONE VALUES

    update_data = {

        k: v
        for k, v in update_data.items()
        if v is not None

    }

    profiles_col.update_one(

        {"userId": u_id},

        {"$set": update_data},

        upsert=True

    )

    return jsonify({
        "message": "Profile updated successfully"
    }), 200


# =========================================
# GET PROFILE
# =========================================
@profile_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):

    u_id = ObjectId(user_id)

    user = users_col.find_one({
        "_id": u_id
    })

    profile = profiles_col.find_one({
        "userId": u_id
    })

    if not profile:

        return jsonify({
            "error": "Profile not found"
        }), 404

    # =====================================
    # PROFILE COMPLETION CALCULATION
    # =====================================

    fields = [

        profile.get("skills"),

        profile.get("interests"),

        profile.get("career_goal"),

        profile.get("company"),

        profile.get("experience"),

        profile.get("bio"),

        profile.get("education"),

        profile.get("domain"),

        profile.get("linkedin"),

        profile.get("github"),

        profile.get("portfolio"),

        profile.get("achievements")

    ]

    completed = len([
        f for f in fields
        if f and str(f).strip() != ""
    ])

    completion_score = int(
        (completed / len(fields)) * 100
    )

    return jsonify({

        "user_id": str(profile["userId"]),

        "name":
            user.get("name")
            if user else "",

        "email":
            user.get("email")
            if user else "",

        "role":
            user.get("role")
            if user else "",

        "skills":
            profile.get("skills", ""),

        "interests":
            profile.get("interests", ""),

        "career_goal":
            profile.get("career_goal", ""),

        "company":
            profile.get("company", ""),

        "experience":
            profile.get("experience", ""),

        "bio":
            profile.get("bio", ""),

        "education":
            profile.get("education", ""),

        "domain":
            profile.get("domain", ""),

        "linkedin":
            profile.get("linkedin", ""),

        "github":
            profile.get("github", ""),

        "portfolio":
            profile.get("portfolio", ""),

        "achievements":
            profile.get("achievements", ""),

        "availability":
            profile.get(
                "availability",
                "Available for mentorship"
            ),

        "completion_score":
            completion_score,

        "updatedAt":
            profile.get("updatedAt")

    }), 200


# =========================================
# GET PROFILE STATS
# =========================================
@profile_bp.route("/profile-stats/<user_id>", methods=["GET"])
def get_profile_stats(user_id):

    u_id = ObjectId(user_id)

    profile = profiles_col.find_one({
        "userId": u_id
    })

    if not profile:

        return jsonify({
            "completion": 0
        }), 200

    fields = [

        "skills",
        "interests",
        "career_goal",
        "company",
        "experience",
        "bio",
        "education",
        "domain",
        "linkedin",
        "github",
        "portfolio",
        "achievements"

    ]

    completed = len([

        field
        for field in fields

        if profile.get(field)

    ])

    completion = int(
        (completed / len(fields)) * 100
    )

    return jsonify({

        "completion": completion,

        "total_fields": len(fields),

        "completed_fields": completed

    }), 200