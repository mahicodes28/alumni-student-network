from flask import Blueprint, request, jsonify
from db import (
    users_col,
    profiles_col,
    broadcasts_col,
    requests_col
)

from bson import ObjectId
from datetime import datetime
import math
import re

alumni_bp = Blueprint("alumni", __name__)

# =========================================
# SEARCH ALUMNI
# =========================================
@alumni_bp.route("/alumni", methods=["GET"])
def search_alumni():

    skill = request.args.get("skill", "").lower()
    company = request.args.get("company", "").lower()
    q = request.args.get("q", "").strip()

    pipeline = [

        {
            "$match": {
                "role": "alumni"
                # Removed status check to show all alumni for testing
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

    # If a combined query `q` is provided, add a regex match stage
    # to match against profile.skills, profile.company, or user name (case-insensitive)
    if q:
        pipeline.append({
            "$match": {
                "$or": [
                    {"profile.skills": {"$regex": q, "$options": "i"}},
                    {"profile.company": {"$regex": q, "$options": "i"}},
                    {"name": {"$regex": q, "$options": "i"}}
                ]
            }
        })
    else:
        # If separate skill/company filters are provided, match them if non-empty
        sconds = []
        if skill:
            sconds.append({"profile.skills": {"$regex": skill, "$options": "i"}})
        if company:
            sconds.append({"profile.company": {"$regex": company, "$options": "i"}})
        if sconds:
            pipeline.append({"$match": {"$and": sconds}})

    alumni_list = list(users_col.aggregate(pipeline))

    results = []

    for a in alumni_list:

        profile = a.get("profile", {})

        results.append({
            "id": str(a["_id"]),
            "name": a.get("name"),
            "company": profile.get("company", "N/A"),
            "experience": profile.get("experience", "N/A"),
            "skills": profile.get("skills", ""),
            "bio": profile.get("bio", ""),
            "linkedin": profile.get("linkedin", "")
        })

    # debug log: print number of results for the query
    try:
        print(f"Alumni search q='{q}' skill='{skill}' company='{company}' -> {len(results)} results")
    except Exception:
        pass

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
def clean_text(text):
    if not text:
        return []
    words = re.findall(r'\b\w+\b', text.lower())
    return words

@alumni_bp.route("/recommendations/<student_id>", methods=["GET"])
def get_recommendations(student_id):

    s_id = ObjectId(student_id)

    student_profile = profiles_col.find_one({
        "userId": s_id
    })

    if not student_profile:
        return jsonify({"data": []}), 200

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

    # Retrieve student profile fields
    s_skills = clean_text(student_profile.get("skills", ""))
    s_interests = clean_text(student_profile.get("interests", ""))
    s_career_goal = clean_text(student_profile.get("career_goal", ""))
    s_domain = clean_text(student_profile.get("domain", ""))
    s_bio = clean_text(student_profile.get("bio", ""))
    
    # Weight key fields by repeating them
    student_words = s_skills * 3 + s_interests * 2 + s_career_goal * 2 + s_domain * 2 + s_bio
    
    if not student_words:
        recommendations = []
        for a in alumni_list:
            profile = a.get("profile", {}) or {}
            recommendations.append({
                "id": str(a["_id"]),
                "name": a.get("name"),
                "skills": profile.get("skills", ""),
                "match": 0,
                "company": profile.get("company", "N/A"),
                "experience": profile.get("experience", "N/A")
            })
        return jsonify({"data": recommendations[:5]}), 200
        
    alumni_docs = []
    for a in alumni_list:
        profile = a.get("profile", {}) or {}
        a_skills = clean_text(profile.get("skills", ""))
        a_interests = clean_text(profile.get("interests", ""))
        a_domain = clean_text(profile.get("domain", ""))
        a_company = clean_text(profile.get("company", ""))
        a_experience = clean_text(profile.get("experience", ""))
        a_bio = clean_text(profile.get("bio", ""))
        
        # Weight alumni fields similarly
        alumni_words = a_skills * 3 + a_interests * 2 + a_domain * 2 + a_company * 2 + a_experience + a_bio
        alumni_docs.append((a, alumni_words))
        
    all_docs = [student_words] + [words for _, words in alumni_docs]
    N = len(all_docs)
    
    # Document Frequency
    df = {}
    for doc in all_docs:
        seen = set(doc)
        for w in seen:
            df[w] = df.get(w, 0) + 1
            
    # Inverse Document Frequency
    idf = {}
    for w, count in df.items():
        idf[w] = math.log(1 + N / (1 + count))
        
    def get_tfidf_vector(words):
        if not words:
            return {}
        tf = {}
        for w in words:
            tf[w] = tf.get(w, 0) + 1
        
        vector = {}
        for w, count in tf.items():
            vector[w] = (count / len(words)) * idf.get(w, 0)
        return vector
        
    student_vector = get_tfidf_vector(student_words)
    student_mag = math.sqrt(sum(v**2 for v in student_vector.values()))
    
    recommendations = []
    for a, words in alumni_docs:
        profile = a.get("profile", {}) or {}
        if not words:
            match_score = 0
        else:
            alumni_vector = get_tfidf_vector(words)
            dot_product = 0.0
            for w in student_vector:
                if w in alumni_vector:
                    dot_product += student_vector[w] * alumni_vector[w]
            
            alumni_mag = math.sqrt(sum(v**2 for v in alumni_vector.values()))
            if student_mag * alumni_mag == 0:
                similarity = 0.0
            else:
                similarity = dot_product / (student_mag * alumni_mag)
            
            match_score = int(round(similarity * 100))
            
        student_domain_val = student_profile.get("domain", "").strip().lower()
        alumni_domain_val = profile.get("domain", "").strip().lower()
        if student_domain_val and alumni_domain_val and student_domain_val == alumni_domain_val:
            match_score = max(match_score, 15)
            
        match_score = min(match_score, 100)

        recommendations.append({
            "id": str(a["_id"]),
            "name": a.get("name"),
            "skills": profile.get("skills", ""),
            "match": match_score,
            "company": profile.get("company", "N/A"),
            "experience": profile.get("experience", "N/A")
        })
        
    # Sort by match score descending
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