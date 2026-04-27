from flask import Blueprint, request, jsonify
from db import requests_col, users_col
from datetime import datetime
from bson import ObjectId

mentorship_bp = Blueprint("mentorship", __name__)

@mentorship_bp.route("/request", methods=["POST"])
def send_request():
    data = request.get_json()

    if "student_id" not in data or "alumni_id" not in data:
        return jsonify({"error": "student_id and alumni_id required"}), 400

    student_id = ObjectId(data["student_id"])
    alumni_id = ObjectId(data["alumni_id"])

    existing = requests_col.find_one({
        "studentId": student_id,
        "alumniId": alumni_id
    })

    if existing:
        return jsonify({"error": "Request already exists"}), 409

    requests_col.insert_one({
        "studentId": student_id,
        "alumniId": alumni_id,
        "status": "pending",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    })

    return jsonify({"message": "Request sent successfully"}), 201

@mentorship_bp.route("/requests/<user_id>", methods=["GET"])
def get_requests(user_id):
    u_id = ObjectId(user_id)
    user = users_col.find_one({"_id": u_id})
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["role"] == "alumni":
        requests = list(requests_col.find({"alumniId": u_id}))
    else:
        requests = list(requests_col.find({"studentId": u_id}))

    result = []
    for r in requests:
        other_id = r["studentId"] if user["role"] == "alumni" else r["alumniId"]
        other_user = users_col.find_one({"_id": other_id})

        result.append({
            "request_id": str(r["_id"]),
            "other_id": str(other_id),
            "other_name": other_user["name"] if other_user else "Unknown",
            "status": r["status"]
        })

    return jsonify({"count": len(result), "data": result}), 200

@mentorship_bp.route("/advanced-stats/<user_id>", methods=["GET"])
def advanced_stats(user_id):
    u_id = ObjectId(user_id)
    user = users_col.find_one({"_id": u_id})
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["role"] == "alumni":
        requests = list(requests_col.find({"alumniId": u_id}))
    else:
        requests = list(requests_col.find({"studentId": u_id}))

    total = len(requests)
    accepted = len([r for r in requests if r["status"] == "accepted"])
    pending = len([r for r in requests if r["status"] == "pending"])
    rejected = len([r for r in requests if r["status"] == "rejected"])

    score = (accepted / total * 100) if total > 0 else 0

    if user["role"] == "alumni":
        insight = "🔥 Highly active mentor" if score > 70 else "👍 Good engagement"
        if total == 0: insight = "No requests yet"
    else:
        insight = "✅ Great connection rate" if score > 50 else "🚀 Keep reaching out"
        if total == 0: insight = "Start connecting with alumni!"

    return jsonify({
        "total": total,
        "accepted": accepted,
        "pending": pending,
        "rejected": rejected,
        "engagement_score": round(score, 2),
        "insight": insight
    })

@mentorship_bp.route("/request/<request_id>", methods=["PUT"])
def update_request(request_id):
    data = request.get_json()
    r_id = ObjectId(request_id)

    allowed_status = ["pending", "accepted", "rejected"]
    if "status" not in data or data["status"] not in allowed_status:
        return jsonify({"error": "Invalid status"}), 400

    requests_col.update_one(
        {"_id": r_id},
        {"$set": {"status": data["status"], "updatedAt": datetime.utcnow()}}
    )

    return jsonify({"message": "Request updated successfully"}), 200