from flask import Flask, jsonify

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

app = Flask(__name__)

CORS(app)

# =========================================
# MONGODB ATLAS CONFIG
# =========================================

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:

    raise Exception(
        "MONGO_URI not found in .env file"
    )

try:

    client = MongoClient(

        MONGO_URI,

        tls=True,

        tlsCAFile=certifi.where()

    )

    # TEST CONNECTION

    client.admin.command("ping")

    print(
        "MongoDB Atlas connected successfully"
    )

except Exception as e:

    print(
        "MongoDB connection error:",
        e
    )

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

app.register_blueprint(
    auth_bp,
    url_prefix="/api"
)

app.register_blueprint(
    profile_bp,
    url_prefix="/api"
)

app.register_blueprint(
    alumni_bp,
    url_prefix="/api"
)

app.register_blueprint(
    mentorship_bp,
    url_prefix="/api"
)

app.register_blueprint(
    admin_bp,
    url_prefix="/api"
)

app.register_blueprint(
    messages_bp,
    url_prefix="/api"
)

app.register_blueprint(
    broadcasts_bp,
    url_prefix="/api"
)

# =========================================
# HOME ROUTE
# =========================================

@app.route("/")
def home():

    return jsonify({

        "message":
        "AlumniConnect Backend Running",

        "database":
        "MongoDB Atlas Connected",

        "status":
        "success"

    })

# =========================================
# HEALTH CHECK ROUTE
# =========================================

@app.route("/health")
def health_check():

    return jsonify({

        "server": "running",

        "database": "connected",

        "environment":
            os.getenv(
                "FLASK_ENV",
                "development"
            )

    })

# =========================================
# MAIN SERVER
# =========================================

if __name__ == "__main__":

    env = os.getenv(
        "FLASK_ENV",
        "development"
    )

    port = int(
        os.getenv("PORT", 5001)
    )

    if env == "production":

        from waitress import serve

        print(
            f"Starting production server on port {port}"
        )

        serve(

            app,

            host="0.0.0.0",

            port=port

        )

    else:

        print(
            f"Starting development server on port {port}"
        )

        app.run(

            debug=True,

            host="127.0.0.1",

            port=port

        )