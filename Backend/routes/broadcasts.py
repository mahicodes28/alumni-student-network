from flask import Blueprint, request, jsonify, g
from utils.auth_middleware import token_required

from db import (
    broadcasts_col,
    users_col,
    profiles_col
)

from bson import ObjectId

from datetime import datetime

broadcasts_bp = Blueprint(
    "broadcasts",
    __name__
)

@broadcasts_bp.before_request
@token_required
def before_broadcasts_request():
    pass

# =========================================
# CREATE BROADCAST
# =========================================
@broadcasts_bp.route(
    "/broadcasts",
    methods=["POST"]
)
def create_broadcast():

    data = request.get_json()

    if g.current_user["user_id"] != data.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 403

    required = [
        "user_id",
        "title",
        "description",
        "type"
    ]

    for field in required:

        if field not in data:

            return jsonify({
                "error":
                f"{field} is required"
            }), 400

    user_id = ObjectId(data["user_id"])

    user = users_col.find_one({
        "_id": user_id
    })

    if not user:

        return jsonify({
            "error": "User not found"
        }), 404

    profile = profiles_col.find_one({
        "userId": user_id
    })

    broadcast = {

        "userId": user_id,

        "name":
            user.get("name", ""),

        "role":
            user.get("role", ""),

        "company":

            profile.get("company", "")

            if profile else "",

        "domain":

            profile.get("domain", "")

            if profile else "",

        "title":
            data["title"],

        "description":
            data["description"],

        "type":
            data["type"],

        "link":
            data.get("link", ""),

        "status": "active",

        "createdAt":
            datetime.utcnow()

    }

    broadcasts_col.insert_one(
        broadcast
    )

    return jsonify({

        "message":
            "Broadcast created successfully"

    }), 201


# =========================================
# GET ALL BROADCASTS
# =========================================
@broadcasts_bp.route(
    "/broadcasts",
    methods=["GET"]
)
def get_broadcasts():

    query = {
        "status": "active"
    }

    # OPTIONAL FILTERS

    company = request.args.get(
        "company"
    )

    b_type = request.args.get(
        "type"
    )

    if company:

        query["company"] = {
            "$regex": company,
            "$options": "i"
        }

    if b_type:

        query["type"] = {
            "$regex": b_type,
            "$options": "i"
        }

    broadcasts = list(

        broadcasts_col.find(query)

        .sort("createdAt", -1)

    )

    result = []

    for b in broadcasts:

        result.append({

            "id":
                str(b["_id"]),

            "user_id":
                str(b["userId"]),

            "name":
                b.get("name", ""),

            "role":
                b.get("role", ""),

            "company":
                b.get("company", ""),

            "domain":
                b.get("domain", ""),

            "title":
                b.get("title", ""),

            "description":
                b.get("description", ""),

            "type":
                b.get("type", ""),

            "link":
                b.get("link", ""),

            "createdAt":

                b.get(
                    "createdAt"
                ).isoformat()

        })

    return jsonify({

        "count": len(result),

        "data": result

    }), 200


# =========================================
# GET USER BROADCASTS
# =========================================
@broadcasts_bp.route(
    "/my-broadcasts/<user_id>",
    methods=["GET"]
)
def get_user_broadcasts(user_id):

    if g.current_user["user_id"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    u_id = ObjectId(user_id)

    broadcasts = list(

        broadcasts_col.find({
            "userId": u_id
        }).sort("createdAt", -1)

    )

    result = []

    for b in broadcasts:

        result.append({

            "id":
                str(b["_id"]),

            "title":
                b.get("title", ""),

            "description":
                b.get("description", ""),

            "type":
                b.get("type", ""),

            "company":
                b.get("company", ""),

            "status":
                b.get("status", ""),

            "createdAt":

                b.get(
                    "createdAt"
                ).isoformat()

        })

    return jsonify({

        "count": len(result),

        "data": result

    }), 200


# =========================================
# DELETE BROADCAST
# =========================================
@broadcasts_bp.route(
    "/broadcasts/<broadcast_id>",
    methods=["DELETE"]
)
def delete_broadcast(broadcast_id):

    b_id = ObjectId(broadcast_id)

    # Only allow author or admin to delete broadcast
    post = broadcasts_col.find_one({"_id": b_id})
    if not post:
        return jsonify({"error": "Broadcast not found"}), 404
    if g.current_user["role"] != "admin" and g.current_user["user_id"] != str(post.get("userId")):
        return jsonify({"error": "Unauthorized"}), 403

    result = broadcasts_col.delete_one({
        "_id": b_id
    })

    if result.deleted_count == 0:

        return jsonify({
            "error":
            "Broadcast not found"
        }), 404

    return jsonify({

        "message":
            "Broadcast deleted successfully"

    }), 200


# =========================================
# ADMIN BROADCAST STATS
# =========================================
@broadcasts_bp.route(
    "/broadcast-stats",
    methods=["GET"]
)
def broadcast_stats():

    total = broadcasts_col.count_documents({})

    internships = broadcasts_col.count_documents({
        "type": {
            "$regex": "internship",
            "$options": "i"
        }
    })

    jobs = broadcasts_col.count_documents({
        "type": {
            "$regex": "job",
            "$options": "i"
        }
    })

    events = broadcasts_col.count_documents({
        "type": {
            "$regex": "event",
            "$options": "i"
        }
    })

    return jsonify({

        "total_broadcasts":
            total,

        "internships":
            internships,

        "jobs":
            jobs,

        "events":
            events

    }), 200