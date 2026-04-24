from flask import Blueprint, jsonify
from db import users_col, profiles_col, requests_col

admin_bp = Blueprint("admin", __name__)


# ================= GET ALL USERS =================
@admin_bp.route("/users", methods=["GET"])
def get_users():
    users = list(users_col.find({}, {"password": 0}))  # Exclude password

    result = []
    for u in users:
        result.append({
            "id": str(u["_id"]),
            "name": u["name"],
            "email": u["email"],
            "role": u["role"]
        })

    return jsonify({
        "count": len(result),
        "data": result
    }), 200


# ================= DASHBOARD STATS =================
@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    total_users = users_col.count_documents({})
    total_students = users_col.count_documents({"role": "student"})
    total_alumni = users_col.count_documents({"role": "alumni"})
    total_profiles = profiles_col.count_documents({})
    total_requests = requests_col.count_documents({})

    return jsonify({
        "total_users": total_users,
        "students": total_students,
        "alumni": total_alumni,
        "profiles": total_profiles,
        "mentorship_requests": total_requests
    }), 200