from flask import Blueprint, request, jsonify
from models import User, Profile

alumni_bp = Blueprint("alumni", __name__)


# ================= SEARCH ALUMNI =================
@alumni_bp.route("/alumni", methods=["GET"])
def search_alumni():
    skill = request.args.get("skill", "").lower()

    # ✅ Join User + Profile (better performance)
    results = []

    profiles = Profile.query.join(User, Profile.user_id == User.id).filter(User.role == "alumni").all()

    for p in profiles:
        if skill in (p.skills or "").lower():
            results.append({
                "id": p.user.id,
                "name": p.user.name,
                "skills": p.skills,
                "company": p.company,
                "experience": p.experience
            })

    return jsonify({
        "count": len(results),
        "data": results
    }), 200