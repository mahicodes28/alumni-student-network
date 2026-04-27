from flask import Blueprint, request, jsonify
from db import messages_col, requests_col, users_col
from datetime import datetime
from bson import ObjectId

messages_bp = Blueprint("messages", __name__)

# ================= SEND MESSAGE =================
@messages_bp.route("/messages", methods=["POST"])
def send_message():
    data = request.get_json()
    sender_id = ObjectId(data.get("sender_id"))
    receiver_id = ObjectId(data.get("receiver_id"))
    content = data.get("content")

    if not content:
        return jsonify({"error": "Message content is required"}), 400

    message = {
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "content": content,
        "timestamp": datetime.utcnow(),
        "read": False
    }

    messages_col.insert_one(message)
    return jsonify({"message": "Message sent"}), 201

# ================= GET CONVERSATION =================
@messages_bp.route("/messages/<other_id>", methods=["GET"])
def get_conversation(other_id):
    user_id = request.args.get("user_id") # We pass current user_id in query params for now
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    
    u_id = ObjectId(user_id)
    o_id = ObjectId(other_id)

    # Fetch messages between two users (either way)
    messages = list(messages_col.find({
        "$or": [
            {"sender_id": u_id, "receiver_id": o_id},
            {"sender_id": o_id, "receiver_id": u_id}
        ]
    }).sort("timestamp", 1))

    result = []
    for m in messages:
        result.append({
            "id": str(m["_id"]),
            "sender_id": str(m["sender_id"]),
            "receiver_id": str(m["receiver_id"]),
            "content": m["content"],
            "timestamp": m["timestamp"].isoformat()
        })

    return jsonify({"data": result}), 200

# ================= GET CHAT CONTACTS =================
@messages_bp.route("/contacts/<user_id>", methods=["GET"])
def get_contacts(user_id):
    u_id = ObjectId(user_id)
    
    # Get all accepted requests where user is either student or alumni
    connections = list(requests_col.find({
        "status": "accepted",
        "$or": [{"studentId": u_id}, {"alumniId": u_id}]
    }))

    contacts = []
    for c in connections:
        other_id = c["alumniId"] if c["studentId"] == u_id else c["studentId"]
        other_user = users_col.find_one({"_id": other_id}, {"password": 0})
        
        if other_user:
            contacts.append({
                "id": str(other_user["_id"]),
                "name": other_user["name"],
                "role": other_user["role"]
            })

    return jsonify({"data": contacts}), 200
