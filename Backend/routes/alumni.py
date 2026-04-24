from flask import Blueprint, request, jsonify
from db import users_col, profiles_col
from bson import ObjectId

alumni_bp = Blueprint("alumni", __name__)

# ================= SEARCH ALUMNI =================
@alumni_bp.route("/alumni", methods=["GET"])
def search_alumni():
    skill = request.args.get("skill", "").lower()

    # MongoDB aggregation to join users and profiles
    pipeline = [
        {
            "$match": {"role": "alumni"}
        },
        {
            "$lookup": {
                "from": "profiles",
                "localField": "_id",
                "foreignField": "userId",
                "as": "profile"
            }
        },
        {
            "$unwind": {
                "path": "$profile",
                "preserveNullAndEmptyArrays": True
            }
        }
    ]

    alumni_list = list(users_col.aggregate(pipeline))
    results = []

    for a in alumni_list:
        profile = a.get("profile", {})
        skills = profile.get("skills", "")
        
        if skill in skills.lower():
            results.append({
                "id": str(a["_id"]),
                "name": a["name"],
                "skills": skills,
                "company": profile.get("company", "N/A"),
                "experience": profile.get("experience", "N/A")
            })

    return jsonify({
        "count": len(results),
        "data": results
    }), 200