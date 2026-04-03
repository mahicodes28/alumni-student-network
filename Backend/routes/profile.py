from flask import Blueprint, request, jsonify
from models import db, Profile, User

profile_bp = Blueprint("profile", __name__)


# ================= CREATE / UPDATE PROFILE =================
@profile_bp.route("/profile", methods=["POST"])
def create_or_update_profile():
    data = request.get_json()

    # ✅ Validate input
    if "user_id" not in data:
        return jsonify({"error": "user_id is required"}), 400

    user = User.query.get(data["user_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    # ✅ Check if profile already exists
    profile = Profile.query.filter_by(user_id=data["user_id"]).first()

    if profile:
        # 🔄 Update existing profile
        profile.skills = data.get("skills", profile.skills)
        profile.interests = data.get("interests", profile.interests)
        profile.career_goal = data.get("career_goal", profile.career_goal)
        profile.company = data.get("company", profile.company)
        profile.experience = data.get("experience", profile.experience)

        message = "Profile updated successfully"

    else:
        # 🆕 Create new profile
        profile = Profile(
            user_id=data["user_id"],
            skills=data.get("skills"),
            interests=data.get("interests"),
            career_goal=data.get("career_goal"),
            company=data.get("company"),
            experience=data.get("experience")
        )
        db.session.add(profile)
        message = "Profile created successfully"

    db.session.commit()

    return jsonify({"message": message}), 200


# ================= GET PROFILE =================
@profile_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "user_id": profile.user_id,
        "skills": profile.skills,
        "interests": profile.interests,
        "career_goal": profile.career_goal,
        "company": profile.company,
        "experience": profile.experience
    }), 200