from flask import Blueprint, request, jsonify
from models import User, Profile

alumni_bp = Blueprint("alumni", __name__)

@alumni_bp.route("/alumni", methods=["GET"])
def search_alumni():
    skill = request.args.get("skill", "").lower()

    results = []

    profiles = Profile.query.all()

    for p in profiles:
        user = User.query.get(p.user_id)

        if user and user.role == "alumni":
            if skill in (p.skills or "").lower():
                results.append({
                    "id": user.id,
                    "name": user.name,
                    "skills": p.skills,
                    "company": p.company,
                    "experience": p.experience
                })

    return jsonify(results)