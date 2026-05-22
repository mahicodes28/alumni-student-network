from flask import Blueprint, request, jsonify
from db import (
    users_col,
    profiles_col,
    broadcasts_col,
    requests_col
)

from bson import ObjectId
from datetime import datetime

alumni_bp = Blueprint("alumni", __name__)

# =========================================
# SEARCH ALUMNI
# =========================================
@alumni_bp.route("/alumni", methods=["GET"])
def search_alumni():

    skill = request.args.get("skill", "").lower()
    company = request.args.get("company", "").lower()

    pipeline = [

        {
            "$match": {
                "role": "alumni",
                "status": "approved"
            }
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

        skills = profile.get("skills", "").lower()
        comp = profile.get("company", "").lower()

        if skill and skill not in skills:
            continue

        if company and company not in comp:
            continue

        results.append({
            "id": str(a["_id"]),
            "name": a.get("name"),
            "company": profile.get("company", "N/A"),
            "experience": profile.get("experience", "N/A"),
            "skills": profile.get("skills", ""),
            "bio": profile.get("bio", ""),
            "linkedin": profile.get("linkedin", "")
        })

    return jsonify({
        "count": len(results),
        "data": results
    }), 200


# =========================================
# SINGLE ALUMNI PROFILE
# =========================================
@alumni_bp.route("/alumni/<alumni_id>", methods=["GET"])
def get_alumni_profile(alumni_id):

    alumni = users_col.find_one({
        "_id": ObjectId(alumni_id)
    })

    if not alumni:
        return jsonify({
            "error": "Alumni not found"
        }), 404

    profile = profiles_col.find_one({
        "userId": ObjectId(alumni_id)
    })

    return jsonify({

        "id": str(alumni["_id"]),
        "name": alumni.get("name"),
        "email": alumni.get("email"),

        "company": profile.get("company", "N/A") if profile else "N/A",

        "experience": profile.get("experience", "N/A") if profile else "N/A",

        "skills": profile.get("skills", "") if profile else "",

        "bio": profile.get("bio", "") if profile else "",

        "linkedin": profile.get("linkedin", "") if profile else ""

    }), 200


# =========================================
# RECOMMENDATIONS
# =========================================
@alumni_bp.route("/recommendations/<student_id>", methods=["GET"])
def get_recommendations(student_id):

    s_id = ObjectId(student_id)

    student_profile = profiles_col.find_one({
        "userId": s_id
    })

    if not student_profile:
        return jsonify({"data": []}), 200

    student_keywords = set(

        (
            student_profile.get("skills", "") +
            " " +
            student_profile.get("interests", "")
        )

        .lower()
        .replace(",", " ")
        .split()
    )

    pipeline = [

        {
            "$match": {
                "role": "alumni",
                "status": "approved"
            }
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
            "$unwind": "$profile"
        }

    ]

    alumni_list = list(users_col.aggregate(pipeline))

    recommendations = []

    for a in alumni_list:

        alumni_profile = a.get("profile", {})

        alumni_skills = set(

            alumni_profile
            .get("skills", "")
            .lower()
            .replace(",", " ")
            .split()

        )

        if not student_keywords:
            continue

        matches = student_keywords.intersection(alumni_skills)

        match_score = int(
            (len(matches) / len(student_keywords)) * 100
        )

        if match_score > 0:

            recommendations.append({

                "id": str(a["_id"]),
                "name": a.get("name"),

                "skills": alumni_profile.get("skills", ""),

                "match": match_score,

                "company": alumni_profile.get("company", "N/A"),

                "experience": alumni_profile.get("experience", "N/A")

            })

    recommendations.sort(
        key=lambda x: x["match"],
        reverse=True
    )

    return jsonify({
        "data": recommendations[:5]
    }), 200


# =========================================
# CREATE BROADCAST POST
# =========================================
@alumni_bp.route("/broadcast", methods=["POST"])
def create_broadcast():

    data = request.json

    new_post = {

        "alumniId": data["alumniId"],

        "title": data["title"],

        "company": data["company"],

        "description": data["description"],

        "type": data["type"],

        "createdAt": datetime.utcnow()

    }

    broadcasts_col.insert_one(new_post)

    return jsonify({
        "message": "Broadcast created"
    }), 201


# =========================================
# GET ALL BROADCASTS
# =========================================
@alumni_bp.route("/broadcasts", methods=["GET"])
def get_broadcasts():

    posts = list(
        broadcasts_col.find().sort("createdAt", -1)
    )

    result = []

    for p in posts:

        result.append({

            "id": str(p["_id"]),

            "title": p.get("title"),

            "company": p.get("company"),

            "description": p.get("description"),

            "type": p.get("type"),

            "createdAt": p.get("createdAt")

        })

    return jsonify({
        "count": len(result),
        "data": result
    }), 200


# =========================================
# DELETE BROADCAST
# =========================================
@alumni_bp.route("/broadcast/<post_id>", methods=["DELETE"])
def delete_broadcast(post_id):

    broadcasts_col.delete_one({
        "_id": ObjectId(post_id)
    })

    return jsonify({
        "message": "Broadcast deleted"
    }), 200


# =========================================
# ALUMNI ANALYTICS
# =========================================
@alumni_bp.route("/analytics/<alumni_id>", methods=["GET"])
def alumni_analytics(alumni_id):

    total_posts = broadcasts_col.count_documents({
        "alumniId": alumni_id
    })

    total_requests = requests_col.count_documents({
        "alumniId": alumni_id
    })

    accepted_requests = requests_col.count_documents({
        "alumniId": alumni_id,
        "status": "accepted"
    })

    return jsonify({

        "posts": total_posts,

        "requests": total_requests,

        "accepted_requests": accepted_requests

    }), 200