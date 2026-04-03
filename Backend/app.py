from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from models import db

# Routes
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.alumni import alumni_bp
from routes.mentorship import mentorship_bp
from routes.admin import admin_bp

import os

# Create Flask app
app = Flask(__name__)

# Base directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Ensure instance folder exists BEFORE DB config
instance_path = os.path.join(BASE_DIR, "instance")
os.makedirs(instance_path, exist_ok=True)

# Database path
db_path = os.path.join(instance_path, "database.db")

# Config
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "secret"

# Extensions
CORS(app)
db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Register routes
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(alumni_bp, url_prefix="/api")
app.register_blueprint(mentorship_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")

# ✅ FIXED SOCKET IMPORT
from sockets.chat import register_socket
register_socket(socketio)

@app.route("/")
def home():
    return "Backend running 🚀"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    socketio.run(app, debug=True)