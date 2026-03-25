from flask import Blueprint, request, jsonify
from models import db, Profile

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile", methods=["POST"])
def create_profile():
    data = request.json

    profile = Profile(
        user_id=data["user_id"],
        skills=data.get("skills"),
        interests=data.get("interests"),
        career_goal=data.get("career_goal"),
        company=data.get("company"),
        experience=data.get("experience")
    )

    db.session.add(profile)
    db.session.commit()

    return jsonify({"message": "Profile created"})


@profile_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "skills": profile.skills,
        "interests": profile.interests,
        "career_goal": profile.career_goal,
        "company": profile.company,
        "experience": profile.experience
    })