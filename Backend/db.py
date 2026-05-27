from pymongo import MongoClient

from dotenv import load_dotenv

import os

import certifi

# =========================================
# LOAD ENV
# =========================================

load_dotenv()

# =========================================
# MONGODB CONNECTION
# =========================================

MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")

# Dynamically configure TLS/SSL based on the connection URI type
if MONGO_URI and MONGO_URI.startswith("mongodb+srv://"):
    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()
    )
else:
    client = MongoClient(MONGO_URI)

# =========================================
# DATABASE
# =========================================

db = client["alumni_network"]

# =========================================
# COLLECTIONS
# =========================================

users_col = db["users"]

profiles_col = db["profiles"]

requests_col = db["requests"]

messages_col = db["messages"]

broadcasts_col = db["broadcasts"]

# =========================================
# OPTIONAL FUTURE COLLECTIONS
# =========================================

notifications_col = db["notifications"]

reports_col = db["reports"]