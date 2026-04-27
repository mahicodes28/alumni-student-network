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


# ================= PENDING ALUMNI =================
@admin_bp.route("/pending", methods=["GET"])
def get_pending_alumni():
    pending = list(users_col.find({"role": "alumni", "status": "pending"}, {"password": 0}))
    
    result = []
    for u in pending:
        result.append({
            "id": str(u["_id"]),
            "name": u["name"],
            "email": u["email"],
            "createdAt": u.get("createdAt", "")
        })

    return jsonify({"data": result}), 200


# ================= APPROVE ALUMNI =================
@admin_bp.route("/approve/<user_id>", methods=["PUT"])
def approve_alumni(user_id):
    from bson import ObjectId
    users_col.update_one({"_id": ObjectId(user_id)}, {"$set": {"status": "approved"}})
    return jsonify({"message": "Alumni approved"}), 200


# ================= REJECT ALUMNI =================
@admin_bp.route("/reject/<user_id>", methods=["PUT"])
def reject_alumni(user_id):
    from bson import ObjectId
    # You could either delete them or mark as rejected
    users_col.update_one({"_id": ObjectId(user_id)}, {"$set": {"status": "rejected"}})
    return jsonify({"message": "Alumni rejected"}), 200


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