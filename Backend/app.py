from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
CORS(app)

# =========================
# MongoDB Atlas Config
# =========================

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in .env file")

try:
    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()
    )

    # Test connection
    client.admin.command("ping")
    print("MongoDB Atlas connected successfully")

except Exception as e:
    print("MongoDB connection error:", e)
    raise e

# Database
db = client["alumni_network"]

# =========================
# Routes
# =========================

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.alumni import alumni_bp
from routes.mentorship import mentorship_bp
from routes.admin import admin_bp

# Register routes
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(alumni_bp, url_prefix="/api")
app.register_blueprint(mentorship_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")

# =========================
# Home Route
# =========================

@app.route("/")
def home():
    return "Backend running with MongoDB Atlas"

# =========================
# Run Server
# =========================

if __name__ == "__main__":
    app.run(debug=True, port=5000)