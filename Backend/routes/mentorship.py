from flask import Blueprint, request, jsonify
from models import db, MentorshipRequest, User
from datetime import datetime

mentorship_bp = Blueprint("mentorship", __name__)


# ================= SEND REQUEST =================
@mentorship_bp.route("/request", methods=["POST"])
def send_request():
    data = request.get_json()

    if "student_id" not in data or "alumni_id" not in data:
        return jsonify({"error": "student_id and alumni_id required"}), 400

    student = User.query.get(data["student_id"])
    alumni = User.query.get(data["alumni_id"])

    if not student or not alumni:
        return jsonify({"error": "Invalid user IDs"}), 404

    # Prevent duplicate request
    existing = MentorshipRequest.query.filter_by(
        student_id=data["student_id"],
        alumni_id=data["alumni_id"]
    ).first()

    if existing:
        return jsonify({"error": "Request already exists"}), 409

    # Create request
    req = MentorshipRequest(
        student_id=data["student_id"],
        alumni_id=data["alumni_id"],
        status="pending"
    )

    db.session.add(req)
    db.session.commit()

    return jsonify({"message": "Request sent successfully"}), 201


# ================= GET REQUESTS =================
@mentorship_bp.route("/requests/<int:alumni_id>", methods=["GET"])
def get_requests(alumni_id):
    requests = MentorshipRequest.query.filter_by(alumni_id=alumni_id).all()

    result = []
    for r in requests:
        student = User.query.get(r.student_id)

        result.append({
            "request_id": r.id,
            "student_id": r.student_id,
            "student_name": student.name if student else "Unknown",
            "status": r.status
        })

    return jsonify({
        "count": len(result),
        "data": result
    }), 200


# ================= ADVANCED ANALYTICS =================
@mentorship_bp.route("/advanced-stats/<int:alumni_id>", methods=["GET"])
def advanced_stats(alumni_id):
    requests = MentorshipRequest.query.filter_by(alumni_id=alumni_id).all()

    total = len(requests)
    accepted = len([r for r in requests if r.status == "accepted"])
    pending = len([r for r in requests if r.status == "pending"])
    rejected = len([r for r in requests if r.status == "rejected"])

    # 📈 Growth Data (timeline simulation)
    growth = {}
    for r in requests:
        day = f"Day {r.id}"   # simple timeline
        growth[day] = growth.get(day, 0) + 1

    # 📊 Engagement Score
    score = (accepted / total * 100) if total > 0 else 0

    # 🤖 Insight Logic
    if total == 0:
        insight = "No activity yet"
    elif score > 70:
        insight = "🔥 Highly active mentor"
    elif score > 40:
        insight = "👍 Good engagement"
    else:
        insight = "⚠️ Needs improvement"

    return jsonify({
        "total": total,
        "accepted": accepted,
        "pending": pending,
        "rejected": rejected,
        "growth": growth,
        "engagement_score": round(score, 2),
        "insight": insight
    })


# ================= UPDATE REQUEST =================
@mentorship_bp.route("/request/<int:id>", methods=["PUT"])
def update_request(id):
    data = request.get_json()

    req = MentorshipRequest.query.get(id)

    if not req:
        return jsonify({"error": "Request not found"}), 404

    allowed_status = ["pending", "accepted", "rejected"]

    if "status" not in data or data["status"] not in allowed_status:
        return jsonify({"error": "Invalid status"}), 400

    req.status = data["status"]
    db.session.commit()

    return jsonify({
        "message": "Request updated successfully",
        "new_status": req.status
    }), 200