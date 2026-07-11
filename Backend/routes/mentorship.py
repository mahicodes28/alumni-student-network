from flask import Blueprint, request, jsonify, g
from db import requests_col, users_col, profiles_col
from utils.auth_middleware import token_required

from datetime import datetime
from bson import ObjectId

mentorship_bp = Blueprint("mentorship", __name__)

@mentorship_bp.before_request
@token_required
def before_mentorship_request():
    pass

# =========================================
# SEND MENTORSHIP REQUEST
# =========================================
@mentorship_bp.route("/request", methods=["POST"])
def send_request():

    data = request.get_json()

    if "student_id" not in data or "alumni_id" not in data:
        return jsonify({
            "error": "student_id and alumni_id required"
        }), 400

    if g.current_user["user_id"] != data["student_id"]:
        return jsonify({"error": "Unauthorized"}), 403

    student_id = ObjectId(data["student_id"])
    alumni_id = ObjectId(data["alumni_id"])

    existing = requests_col.find_one({
        "studentId": student_id,
        "alumniId": alumni_id
    })

    if existing:
        return jsonify({
            "error": "Request already exists"
        }), 409

    requests_col.insert_one({

        "studentId": student_id,

        "alumniId": alumni_id,

        "status": "pending",

        "createdAt": datetime.utcnow(),

        "updatedAt": datetime.utcnow()

    })

    return jsonify({
        "message": "Request sent successfully"
    }), 201


# =========================================
# GET ALL REQUESTS
# =========================================
@mentorship_bp.route("/requests/<user_id>", methods=["GET"])
def get_requests(user_id):

    if g.current_user["user_id"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    u_id = ObjectId(user_id)

    user = users_col.find_one({
        "_id": u_id
    })

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    if user["role"] == "alumni":
        requests = list(
            requests_col.find({"alumniId": u_id})
        )
    else:
        requests = list(
            requests_col.find({"studentId": u_id})
        )

    result = []

    for r in requests:

        other_id = (
            r["studentId"]
            if user["role"] == "alumni"
            else r["alumniId"]
        )

        other_user = users_col.find_one({
            "_id": other_id
        })

        other_profile = profiles_col.find_one({
            "userId": other_id
        })

        result.append({

            "request_id": str(r["_id"]),

            "other_id": str(other_id),

            "other_name":
                other_user["name"]
                if other_user else "Unknown",

            "status": r["status"],

            "createdAt": r.get("createdAt"),

            "company":
                other_profile.get("company", "N/A")
                if other_profile else "N/A",

            "skills":
                other_profile.get("skills", "")
                if other_profile else ""

        })

    return jsonify({

        "count": len(result),

        "data": result

    }), 200


# =========================================
# GET PENDING REQUESTS
# =========================================
@mentorship_bp.route("/pending/<alumni_id>", methods=["GET"])
def get_pending_requests(alumni_id):

    if g.current_user["user_id"] != alumni_id:
        return jsonify({"error": "Unauthorized"}), 403

    a_id = ObjectId(alumni_id)

    requests = list(

        requests_col.find({
            "alumniId": a_id,
            "status": "pending"
        })

    )

    result = []

    for r in requests:

        student = users_col.find_one({
            "_id": r["studentId"]
        })

        profile = profiles_col.find_one({
            "userId": r["studentId"]
        })

        result.append({

            "request_id": str(r["_id"]),

            "student_id": str(r["studentId"]),

            "name":
                student.get("name")
                if student else "Unknown",

            "skills":
                profile.get("skills", "")
                if profile else "",

            "interests":
                profile.get("interests", "")
                if profile else "",

            "createdAt": r.get("createdAt")

        })

    return jsonify({
        "count": len(result),
        "data": result
    }), 200


# =========================================
# GET ACCEPTED MENTEES
# =========================================
@mentorship_bp.route("/mentees/<alumni_id>", methods=["GET"])
def get_mentees(alumni_id):

    if g.current_user["user_id"] != alumni_id:
        return jsonify({"error": "Unauthorized"}), 403

    a_id = ObjectId(alumni_id)

    requests = list(

        requests_col.find({
            "alumniId": a_id,
            "status": "accepted"
        })

    )

    result = []

    for r in requests:

        student = users_col.find_one({
            "_id": r["studentId"]
        })

        profile = profiles_col.find_one({
            "userId": r["studentId"]
        })

        result.append({

            "student_id": str(r["studentId"]),

            "name":
                student.get("name")
                if student else "Unknown",

            "skills":
                profile.get("skills", "")
                if profile else "",

            "interests":
                profile.get("interests", "")
                if profile else "",

            "acceptedAt":
                r.get("updatedAt")

        })

    return jsonify({

        "count": len(result),

        "data": result

    }), 200


# =========================================
# GET CONNECTED MENTORS FOR A STUDENT
# =========================================
@mentorship_bp.route("/my-mentors/<student_id>", methods=["GET"])
def get_my_mentors(student_id):

    if g.current_user["user_id"] != student_id:
        return jsonify({"error": "Unauthorized"}), 403

    s_id = ObjectId(student_id)

    requests = list(

        requests_col.find({
            "studentId": s_id,
            "status": "accepted"
        })

    )

    result = []

    for r in requests:

        alumni = users_col.find_one({
            "_id": r["alumniId"]
        })

        profile = profiles_col.find_one({
            "userId": r["alumniId"]
        })

        result.append({

            "alumni_id": str(r["alumniId"]),

            "name": alumni.get("name") if alumni else "Unknown",

            "company": profile.get("company", "N/A") if profile else "N/A",

            "skills": profile.get("skills", "") if profile else "",

            "connectedAt": r.get("updatedAt")

        })

    return jsonify({

        "count": len(result),

        "data": result

    }), 200


# =========================================
# ADVANCED STATS
# =========================================
@mentorship_bp.route("/advanced-stats/<user_id>", methods=["GET"])
def advanced_stats(user_id):

    if g.current_user["user_id"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    u_id = ObjectId(user_id)

    user = users_col.find_one({
        "_id": u_id
    })

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    if user["role"] == "alumni":

        requests = list(
            requests_col.find({"alumniId": u_id})
        )

    else:

        requests = list(
            requests_col.find({"studentId": u_id})
        )

    total = len(requests)

    accepted = len([
        r for r in requests
        if r["status"] == "accepted"
    ])

    pending = len([
        r for r in requests
        if r["status"] == "pending"
    ])

    rejected = len([
        r for r in requests
        if r["status"] == "rejected"
    ])

    score = (
        accepted / total * 100
    ) if total > 0 else 0

    if user["role"] == "alumni":

        insight = (
            "Highly active mentor"
            if score > 70
            else "Good mentorship engagement"
        )

        if total == 0:
            insight = "No mentorship requests yet"

    else:

        insight = (
            "Great networking progress"
            if score > 50
            else "Keep connecting with alumni"
        )

        if total == 0:
            insight = "Start connecting with alumni"

    return jsonify({

        "total": total,

        "accepted": accepted,

        "pending": pending,

        "rejected": rejected,

        "engagement_score": round(score, 2),

        "insight": insight

    })


# =========================================
# UPDATE REQUEST STATUS
# =========================================
@mentorship_bp.route("/request/<request_id>", methods=["PUT"])
def update_request(request_id):

    data = request.get_json()

    r_id = ObjectId(request_id)

    # Only the alumni who received the request can update it
    req = requests_col.find_one({"_id": r_id})
    if not req:
        return jsonify({"error": "Request not found"}), 404
    if g.current_user["user_id"] != str(req.get("alumniId")):
        return jsonify({"error": "Unauthorized"}), 403

    allowed_status = [
        "pending",
        "accepted",
        "rejected"
    ]

    if (
        "status" not in data
        or data["status"] not in allowed_status
    ):

        return jsonify({
            "error": "Invalid status"
        }), 400

    requests_col.update_one(

        {"_id": r_id},

        {
            "$set": {

                "status": data["status"],

                "updatedAt": datetime.utcnow()

            }
        }

    )

    return jsonify({
        "message": "Request updated successfully"
    }), 200