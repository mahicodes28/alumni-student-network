from flask import Blueprint, request, jsonify
from db import db, profiles_col, users_col
from bson import ObjectId
from datetime import datetime
import os
import requests
import json

ai_bp = Blueprint("ai", __name__)
chatbot_history_col = db["chatbot_history"]

# Groq API Configuration
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
# Using llama-3.3-70b-versatile as the default high-performance model
DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"

def clean_history_for_groq(messages):
    """
    Format database message history into OpenAI/Groq messages array.
    Maps 'assistant' role to 'assistant' (OpenAI/Groq compliant).
    """
    formatted = []
    for msg in messages:
        role = msg.get("role", "user")
        # Ensure role is user or assistant
        if role == "model":
            role = "assistant"
        formatted.append({
            "role": role,
            "content": msg.get("content", "")
        })
    return formatted

def get_fallback_response(user_name, role, profile, user_message):
    """
    Generates a personalized, context-aware simulated response
    if Groq API key is missing or fails.
    """
    message_lower = user_message.lower()
    skills_list = profile.get("skills", "")
    domain = profile.get("domain", "") or "your field"
    goal = profile.get("career_goal", "") or "your career aspirations"
    
    if role != "student":
        return f"Hello {user_name}! As an alum, thank you for supporting the platform. Let me know how I can assist with mentoring tools or platform guides."

    if "resume" in message_lower:
        return f"""### Resume Improvement Tips for **{user_name}** 📄

Based on your profile, here are tailored suggestions to make your resume stand out in **{domain}**:

1. **Highlight Your Core Skills**:
   Make sure your key skills (**{skills_list or 'your tech stack'}**) are prominently displayed in a dedicated "Technical Skills" section near the top.
2. **Quantify Achievements**:
   Instead of just listing responsibilities, write: *"Developed [Project] using {skills_list.split(',')[0] if skills_list else 'technologies'}, improving performance by 20%."*
3. **Align with Career Goal**:
   Your target goal is **"{goal}"**. Ensure your resume summary reflects this focus and highlights relevant projects or coursework.
4. **Alumni Tip**:
   Connect with mentors in companies you target and ask them to review your resume formats.
   
Would you like me to draft a summary section for your resume?"""

    elif "interview" in message_lower or "prep" in message_lower or "placement" in message_lower:
        return f"""### Interview Preparation Plan for **{user_name}** 🎯

Preparing for interviews in **{domain}** requires a structured approach. Here's a customized plan:

1. **Technical Mock Round**:
   Expect deep-dives into your listed skills: **{skills_list or 'your key topics'}**. Review fundamental concepts and prepare to explain your design decisions.
2. **Behavioral Questions (STAR Method)**:
   Prepare stories about challenges you faced, your actions, and the results. Think about your achievements and projects.
3. **Ask Smart Questions**:
   At the end of the interview, ask the interviewer about their team's stack, development practices, and challenges.
4. **Mock Practice**:
   Reach out to alumni in similar roles via the **Alumni Discovery** page for a mock interview!
   
Do you want to practice a specific technical question or do a mock behavioral run?"""

    elif "skill" in message_lower or "learn" in message_lower or "study" in message_lower:
        return f"""### Skill Development Path 🚀

To transition successfully into your goal of **"{goal}"**, here is a recommended skill path:

1. **Strengthen Current Skills**:
   You already have foundation in: **{skills_list or 'your listed skills'}**. Build complex, portfolio-worthy projects using these.
2. **Target Complementary Skills**:
   In the **{domain}** industry, professionals also highly value cloud computing (AWS/GCP), system design, and database optimization.
3. **Certifications & Projects**:
   Consider building open-source projects or gaining recognized industry certifications to validate your expertise.
   
What specific technology or domain area would you like to explore next?"""

    else:
        return f"""### Career Mentorship Guidance 👋

Hello **{user_name}**! I'm your dedicated Career Assistant chatbot. 

I'm ready to help you navigate your journey toward **"{goal}"** in **{domain}**.

Here are some topics we can discuss:
* 📄 **Resume Review**: Get tips on formatting and framing your skills (**{skills_list or 'your tech stack'}**).
* 🎯 **Interview Prep**: Technical and behavioral preparation guides.
* 🚀 **Skills & Goals**: Finding the right tools or domains to study.
* 🎓 **Higher Studies**: Deciding between industry and academia.
* 🤝 **Networking**: How to connect effectively with our registered alumni.

What career questions are on your mind today?"""

# =========================================
# CHATBOT SEND MESSAGE
# =========================================
@ai_bp.route("/career-assistant/chat", methods=["POST"])
def chatbot_chat():
    try:
        data = request.get_json() or {}
        user_id_str = data.get("userId")
        user_message = data.get("message", "").strip()

        if not user_id_str or not user_message:
            return jsonify({"error": "userId and message are required"}), 400

        user_id = ObjectId(user_id_str)

        # Get User details
        user = users_col.find_one({"_id": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_name = user.get("name", "Student")
        user_role = user.get("role", "student")

        # Get Profile details
        profile = profiles_col.find_one({"userId": user_id}) or {}

        # Fetch or initialize chat history
        chat_history = chatbot_history_col.find_one({"userId": user_id})
        if not chat_history:
            chat_history = {
                "userId": user_id,
                "messages": [],
                "createdAt": datetime.utcnow()
            }
            chatbot_history_col.insert_one(chat_history)

        history_messages = chat_history.get("messages", [])

        # Build System Prompt Context
        system_prompt = f"""You are a professional Career Mentor and Assistant on the AlumniConnect platform. You provide expert, tailored guidance on career paths, resume building, interviews, placements, internships, skill development, higher studies, and networking.
You are speaking with {user_name}, who is a student. Here is their profile context:
- Skills: {profile.get('skills', 'None listed')}
- Interests: {profile.get('interests', 'None listed')}
- Career Goal: {profile.get('career_goal', 'None listed')}
- Domain/Field: {profile.get('domain', 'None listed')}
- Education: {profile.get('education', 'None listed')}
- Bio: {profile.get('bio', 'None listed')}

Use this profile context to personalize your guidance, referencing their specific skills, interests, or goals when relevant. Keep your responses highly professional, encouraging, practical, and well-structured using markdown.
"""

        # Prepare messages payload
        payload_messages = [{"role": "system", "content": system_prompt}]
        payload_messages.extend(clean_history_for_groq(history_messages))
        payload_messages.append({"role": "user", "content": user_message})

        # Check API Key
        groq_api_key = os.getenv("GROQ_API_KEY")

        ai_response_text = None
        if groq_api_key:
            headers = {
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            }
            body = {
                "model": DEFAULT_GROQ_MODEL,
                "messages": payload_messages,
                "temperature": 0.7,
                "max_tokens": 1024
            }

            try:
                # Call Groq API
                res = requests.post(GROQ_API_URL, headers=headers, json=body, timeout=15)
                if res.status_code == 200:
                    res_data = res.json()
                    ai_response_text = res_data["choices"][0]["message"]["content"]
                else:
                    print(f"Groq API returned error status {res.status_code}: {res.text}")
            except Exception as e:
                print(f"Failed to fetch response from Groq API: {e}")

        # Fallback to local responder if API failed or API key is not present
        if not ai_response_text:
            ai_response_text = get_fallback_response(user_name, user_role, profile, user_message)

        # Update History in MongoDB
        new_user_msg = {
            "role": "user",
            "content": user_message,
            "timestamp": datetime.utcnow()
        }
        new_assistant_msg = {
            "role": "assistant",
            "content": ai_response_text,
            "timestamp": datetime.utcnow()
        }

        chatbot_history_col.update_one(
            {"userId": user_id},
            {
                "$push": {"messages": {"$each": [new_user_msg, new_assistant_msg]}},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )

        return jsonify({
            "message": ai_response_text,
            "timestamp": new_assistant_msg["timestamp"].isoformat()
        }), 200

    except Exception as e:
        print("Chatbot endpoint exception:", e)
        return jsonify({"error": "Internal server error"}), 500

# =========================================
# GET CHAT HISTORY
# =========================================
@ai_bp.route("/career-assistant/history/<user_id>", methods=["GET"])
def chatbot_history(user_id):
    try:
        u_id = ObjectId(user_id)
        chat = chatbot_history_col.find_one({"userId": u_id})
        
        messages = []
        if chat:
            for msg in chat.get("messages", []):
                messages.append({
                    "role": msg.get("role"),
                    "content": msg.get("content"),
                    "timestamp": msg.get("timestamp").isoformat() if msg.get("timestamp") else None
                })
        
        return jsonify({
            "data": messages
        }), 200

    except Exception as e:
        print("Error getting chatbot history:", e)
        return jsonify({"error": "Internal server error"}), 500

# =========================================
# CLEAR CHAT HISTORY
# =========================================
@ai_bp.route("/career-assistant/history/<user_id>", methods=["DELETE"])
def clear_chatbot_history(user_id):
    try:
        u_id = ObjectId(user_id)
        chatbot_history_col.delete_one({"userId": u_id})
        return jsonify({
            "message": "Chat history cleared successfully"
        }), 200

    except Exception as e:
        print("Error clearing chatbot history:", e)
        return jsonify({"error": "Internal server error"}), 500
