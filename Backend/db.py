from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["alumni_network"]

# Collections
users_col = db["users"]
profiles_col = db["profiles"]
requests_col = db["requests"]
skills_col = db["skills"]
messages_col = db["messages"] # Keeping for now, but not used
