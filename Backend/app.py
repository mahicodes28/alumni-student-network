from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

# =========================================
# LOAD ENV VARIABLES
# =========================================

load_dotenv()

# =========================================
# CREATE FLASK APP
# =========================================

app = Flask(
    __name__,
    static_folder="static",
    static_url_path=""
)

CORS(app)

# =========================================
# MONGODB ATLAS CONFIG
# =========================================

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in environment variables")

try:

    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()
    )

    # TEST CONNECTION
    client.admin.command("ping")

    print("MongoDB Atlas connected successfully")

except Exception as e:

    print("MongoDB connection error:", e)
    raise e

# =========================================
# DATABASE
# =========================================

db = client["alumni_network"]

# =========================================
# IMPORT ROUTES
# =========================================

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.alumni import alumni_bp
from routes.mentorship import mentorship_bp
from routes.admin import admin_bp
from routes.messages import messages_bp
from routes.broadcasts import broadcasts_bp

# =========================================
# REGISTER BLUEPRINTS
# =========================================

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(alumni_bp, url_prefix="/api")
app.register_blueprint(mentorship_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")
app.register_blueprint(messages_bp, url_prefix="/api")
app.register_blueprint(broadcasts_bp, url_prefix="/api")

# =========================================
# API HEALTH ROUTES
# =========================================

@app.route("/api")
def api_home():

    return jsonify({
        "message": "AlumniConnect Backend Running",
        "database": "MongoDB Atlas Connected",
        "status": "success"
    })

@app.route("/health")
def health_check():

    return jsonify({
        "server": "running",
        "database": "connected",
        "environment": os.getenv("FLASK_ENV", "production")
    })

# =========================================
# SERVE REACT FRONTEND
# =========================================

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):

    static_folder_path = app.static_folder

    requested_path = os.path.join(
        static_folder_path,
        path
    )

    # Serve static assets if they exist
    if path != "" and os.path.exists(requested_path):
        return send_from_directory(
            static_folder_path,
            path
        )

    # Otherwise serve React index.html
    return send_from_directory(
        static_folder_path,
        "index.html"
    )

# =========================================
# MAIN SERVER
# =========================================

if __name__ == "__main__":

    port = int(
        os.getenv("PORT", 5000)
    )

    print(f"Server running on port {port}")

    app.run(
        host="0.0.0.0",
        port=port
    )