from flask import Blueprint, jsonify, request
from bson import ObjectId

from db import (
    users_col,
    profiles_col,
    requests_col,
    broadcasts_col,
    messages_col
)

admin_bp = Blueprint("admin", __name__)

# =========================================
# GET ALL USERS
# =========================================
@admin_bp.route("/users", methods=["GET"])
def get_users():

    users = list(users_col.find({}, {"password": 0}))

    result = []

    for u in users:
        result.append({
            "id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email"),
            "role": u.get("role"),
            "status": u.get("status", "approved")
        })

    return jsonify({
        "count": len(result),
        "data": result
    }), 200


# =========================================
# SEARCH USERS
# =========================================
@admin_bp.route("/search-users", methods=["GET"])
def search_users():

    query = request.args.get("q", "")

    users = list(users_col.find({
        "name": {"$regex": query, "$options": "i"}
    }))

    result = []

    for u in users:
        result.append({
            "id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email"),
            "role": u.get("role"),
            "status": u.get("status")
        })

    return jsonify(result), 200


# =========================================
# PENDING ALUMNI
# =========================================
@admin_bp.route("/pending", methods=["GET"])
def get_pending_alumni():

    pending = list(users_col.find({
        "role": "alumni",
        "status": "pending"
    }, {"password": 0}))

    result = []

    for u in pending:
        result.append({
            "id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email"),
            "createdAt": u.get("createdAt", "")
        })

    return jsonify({"data": result}), 200


# =========================================
# APPROVED ALUMNI
# =========================================
@admin_bp.route("/approved", methods=["GET"])
def get_approved_alumni():

    alumni = list(users_col.find({
        "role": "alumni",
        "status": "approved"
    }))

    result = []

    for u in alumni:
        result.append({
            "id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email")
        })

    return jsonify(result), 200


# =========================================
# REJECTED ALUMNI
# =========================================
@admin_bp.route("/rejected", methods=["GET"])
def get_rejected_alumni():

    rejected = list(users_col.find({
        "role": "alumni",
        "status": "rejected"
    }))

    result = []

    for u in rejected:
        result.append({
            "id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email")
        })

    return jsonify(result), 200


# =========================================
# APPROVE ALUMNI
# =========================================
@admin_bp.route("/approve/<user_id>", methods=["PUT"])
def approve_alumni(user_id):

    users_col.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": "approved"}}
    )

    return jsonify({
        "message": "Alumni approved"
    }), 200


# =========================================
# REJECT ALUMNI
# =========================================
@admin_bp.route("/reject/<user_id>", methods=["PUT"])
def reject_alumni(user_id):

    users_col.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": "rejected"}}
    )

    return jsonify({
        "message": "Alumni rejected"
    }), 200


# =========================================
# DELETE USER
# =========================================
@admin_bp.route("/delete-user/<user_id>", methods=["DELETE"])
def delete_user(user_id):

    users_col.delete_one({
        "_id": ObjectId(user_id)
    })

    return jsonify({
        "message": "User deleted"
    }), 200


# =========================================
# GET ALL MENTORSHIP REQUESTS
# =========================================
@admin_bp.route("/mentorships", methods=["GET"])
def get_mentorships():

    requests = list(requests_col.find())

    result = []

    for r in requests:
        result.append({
            "id": str(r["_id"]),
            "studentId": r.get("studentId"),
            "alumniId": r.get("alumniId"),
            "status": r.get("status", "pending")
        })

    return jsonify(result), 200


# =========================================
# GET BROADCAST POSTS
# =========================================
@admin_bp.route("/broadcasts", methods=["GET"])
def get_broadcasts():

    broadcasts = list(broadcasts_col.find())

    result = []

    for b in broadcasts:
        result.append({
            "id": str(b["_id"]),
            "title": b.get("title"),
            "company": b.get("company"),
            "type": b.get("type")
        })

    return jsonify(result), 200


# =========================================
# DELETE BROADCAST
# =========================================
@admin_bp.route("/delete-broadcast/<broadcast_id>", methods=["DELETE"])
def delete_broadcast(broadcast_id):

    broadcasts_col.delete_one({
        "_id": ObjectId(broadcast_id)
    })

    return jsonify({
        "message": "Broadcast removed"
    }), 200


# =========================================
# DASHBOARD STATS
# =========================================
@admin_bp.route("/stats", methods=["GET"])
def get_stats():

    total_users = users_col.count_documents({})
    total_students = users_col.count_documents({
        "role": "student"
    })

    total_alumni = users_col.count_documents({
        "role": "alumni"
    })

    approved_alumni = users_col.count_documents({
        "role": "alumni",
        "status": "approved"
    })

    pending_alumni = users_col.count_documents({
        "role": "alumni",
        "status": "pending"
    })

    total_profiles = profiles_col.count_documents({})
    total_requests = requests_col.count_documents({})
    total_messages = messages_col.count_documents({})
    total_broadcasts = broadcasts_col.count_documents({})

    return jsonify({

        "total_users": total_users,
        "students": total_students,
        "alumni": total_alumni,

        "approved_alumni": approved_alumni,
        "pending_alumni": pending_alumni,

        "profiles": total_profiles,
        "mentorship_requests": total_requests,

        "messages": total_messages,
        "broadcasts": total_broadcasts

    }), 200