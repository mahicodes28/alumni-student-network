from flask import Blueprint, jsonify
from models import User, Profile, MentorshipRequest

admin_bp = Blueprint("admin", __name__)


# ================= GET ALL USERS =================
@admin_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()

    result = []
    for u in users:
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        })

    return jsonify({
        "count": len(result),
        "data": result
    }), 200


# ================= DASHBOARD STATS =================
@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    total_users = User.query.count()
    total_students = User.query.filter_by(role="student").count()
    total_alumni = User.query.filter_by(role="alumni").count()
    total_profiles = Profile.query.count()
    total_requests = MentorshipRequest.query.count()

    return jsonify({
        "total_users": total_users,
        "students": total_students,
        "alumni": total_alumni,
        "profiles": total_profiles,
        "mentorship_requests": total_requests
    }), 200