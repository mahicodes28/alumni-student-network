from flask import Blueprint, request, jsonify
from db import users_col, profiles_col
from bson import ObjectId

alumni_bp = Blueprint("alumni", __name__)

@alumni_bp.route("/alumni", methods=["GET"])
def search_alumni():
    skill = request.args.get("skill", "").lower()

    pipeline = [
        {"$match": {"role": "alumni", "status": "approved"}},
        {
            "$lookup": {
                "from": "profiles",
                "localField": "_id",
                "foreignField": "userId",
                "as": "profile"
            }
        },
        {"$unwind": {"path": "$profile", "preserveNullAndEmptyArrays": True}}
    ]

    alumni_list = list(users_col.aggregate(pipeline))
    results = []

    for a in alumni_list:
        profile = a.get("profile", {})
        skills = profile.get("skills", "")
        
        # If no skill search, show all. If searching, filter by skills.
        if not skill or skill in skills.lower():
            results.append({
                "id": str(a["_id"]),
                "name": a["name"],
                "skills": skills,
                "company": profile.get("company", "N/A"),
                "experience": profile.get("experience", "N/A")
            })

    return jsonify({"count": len(results), "data": results}), 200

# ================= RECOMMENDATIONS =================
@alumni_bp.route("/recommendations/<student_id>", methods=["GET"])
def get_recommendations(student_id):
    s_id = ObjectId(student_id)
    
    # 1. Get student profile
    student_profile = profiles_col.find_one({"userId": s_id})
    if not student_profile:
        return jsonify({"data": []}), 200

    # Combine student interests and skills for matching
    student_keywords = set((student_profile.get("skills", "") + " " + student_profile.get("interests", "")).lower().replace(",", " ").split())
    
    # 2. Get all alumni with profiles and status=approved
    pipeline = [
        {"$match": {"role": "alumni", "status": "approved"}},
        {
            "$lookup": {
                "from": "profiles",
                "localField": "_id",
                "foreignField": "userId",
                "as": "profile"
            }
        },
        {"$unwind": "$profile"}
    ]
    alumni_list = list(users_col.aggregate(pipeline))
    
    recommendations = []
    for a in alumni_list:
        alumni_profile = a.get("profile", {})
        alumni_skills = set(alumni_profile.get("skills", "").lower().replace(",", " ").split())
        
        # Calculate match
        if not student_keywords: continue
        
        matches = student_keywords.intersection(alumni_skills)
        match_score = int((len(matches) / len(student_keywords)) * 100) if student_keywords else 0
        
        if match_score > 0:
            recommendations.append({
                "id": str(a["_id"]),
                "name": a["name"],
                "skills": alumni_profile.get("skills", ""),
                "match": match_score,
                "company": alumni_profile.get("company", "N/A")
            })

    # Sort by match score descending
    recommendations.sort(key=lambda x: x["match"], reverse=True)
    
    return jsonify({"data": recommendations[:5]}), 200 # Return top 5