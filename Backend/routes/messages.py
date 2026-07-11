from flask import Blueprint, request, jsonify, g
from utils.auth_middleware import token_required

from db import (
    messages_col,
    requests_col,
    users_col,
    profiles_col
)

from datetime import datetime

from bson import ObjectId

messages_bp = Blueprint(
    "messages",
    __name__
)

@messages_bp.before_request
@token_required
def before_messages_request():
    pass

# =========================================
# SEND MESSAGE
# =========================================
@messages_bp.route(
    "/messages",
    methods=["POST"]
)
def send_message():

    data = request.get_json()

    sender_id_str = data.get("sender_id")
    if g.current_user["user_id"] != sender_id_str:
        return jsonify({"error": "Unauthorized"}), 403

    sender_id = ObjectId(
        sender_id_str
    )

    receiver_id = ObjectId(
        data.get("receiver_id")
    )

    content = data.get("content")

    if not content:

        return jsonify({
            "error":
            "Message content is required"
        }), 400

    message = {

        "sender_id": sender_id,

        "receiver_id": receiver_id,

        "content": content,

        "timestamp": datetime.utcnow(),

        "read": False,

        "status": "sent"

    }

    messages_col.insert_one(message)

    return jsonify({

        "message": "Message sent",

        "status": "sent"

    }), 201


# =========================================
# GET CONVERSATION
# =========================================
@messages_bp.route(
    "/messages/<other_id>",
    methods=["GET"]
)
def get_conversation(other_id):

    user_id = request.args.get(
        "user_id"
    )

    if not user_id:

        return jsonify({
            "error": "user_id required"
        }), 400

    if g.current_user["user_id"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    u_id = ObjectId(user_id)

    o_id = ObjectId(other_id)

    # =====================================
    # FETCH CONVERSATION
    # =====================================

    messages = list(

        messages_col.find({

            "$or": [

                {
                    "sender_id": u_id,
                    "receiver_id": o_id
                },

                {
                    "sender_id": o_id,
                    "receiver_id": u_id
                }

            ]

        }).sort("timestamp", 1)

    )

    # =====================================
    # MARK RECEIVED MESSAGES AS READ
    # =====================================

    messages_col.update_many(

        {

            "sender_id": o_id,

            "receiver_id": u_id,

            "read": False

        },

        {

            "$set": {

                "read": True,

                "status": "seen"

            }

        }

    )

    result = []

    for m in messages:

        result.append({

            "id": str(m["_id"]),

            "sender_id":
                str(m["sender_id"]),

            "receiver_id":
                str(m["receiver_id"]),

            "content":
                m["content"],

            "timestamp":
                m["timestamp"].isoformat(),

            "read":
                m.get("read", False),

            "status":
                m.get("status", "sent")

        })

    return jsonify({

        "count": len(result),

        "data": result

    }), 200


# =========================================
# GET CONTACTS / CONVERSATIONS
# =========================================
@messages_bp.route(
    "/contacts/<user_id>",
    methods=["GET"]
)
def get_contacts(user_id):

    if g.current_user["user_id"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    u_id = ObjectId(user_id)

    # =====================================
    # ACCEPTED CONNECTIONS ONLY
    # =====================================

    connections = list(

        requests_col.find({

            "status": "accepted",

            "$or": [

                {"studentId": u_id},

                {"alumniId": u_id}

            ]

        })

    )

    contacts = []

    added = set()

    for c in connections:

        other_id = (

            c["alumniId"]

            if c["studentId"] == u_id

            else c["studentId"]

        )

        # PREVENT DUPLICATES

        if str(other_id) in added:
            continue

        added.add(str(other_id))

        other_user = users_col.find_one(

            {"_id": other_id},

            {"password": 0}

        )

        profile = profiles_col.find_one({

            "userId": other_id

        })

        if other_user:

            # =============================
            # LAST MESSAGE
            # =============================

            last_message = messages_col.find_one(

                {

                    "$or": [

                        {
                            "sender_id": u_id,
                            "receiver_id": other_id
                        },

                        {
                            "sender_id": other_id,
                            "receiver_id": u_id
                        }

                    ]

                },

                sort=[("timestamp", -1)]

            )

            # =============================
            # UNREAD COUNT
            # =============================

            unread_count = messages_col.count_documents({

                "sender_id": other_id,

                "receiver_id": u_id,

                "read": False

            })

            contacts.append({

                "id":
                    str(other_user["_id"]),

                "name":
                    other_user["name"],

                "role":
                    other_user["role"],

                "company":

                    profile.get("company", "")

                    if profile else "",

                "domain":

                    profile.get("domain", "")

                    if profile else "",

                "last_message":

                    last_message.get(
                        "content",
                        ""
                    )

                    if last_message else "",

                "last_message_time":

                    last_message.get(
                        "timestamp"
                    ).isoformat()

                    if last_message else "",

                "unread_count":
                    unread_count,

                "online":
                    True

            })

    # =====================================
    # SORT BY RECENT ACTIVITY
    # =====================================

    contacts.sort(

        key=lambda x:
        x.get("last_message_time", ""),

        reverse=True

    )

    return jsonify({

        "count": len(contacts),

        "data": contacts

    }), 200


# =========================================
# GET UNREAD COUNT
# =========================================
@messages_bp.route(
    "/unread/<user_id>",
    methods=["GET"]
)
def unread_messages(user_id):

    if g.current_user["user_id"] != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    u_id = ObjectId(user_id)

    count = messages_col.count_documents({

        "receiver_id": u_id,

        "read": False

    })

    return jsonify({

        "unread_messages": count

    }), 200