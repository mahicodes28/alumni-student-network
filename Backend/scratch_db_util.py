from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["alumni_network"]
users_col = db["users"]
profiles_col = db["profiles"]
requests_col = db["requests"]
skills_col = db["skills"]

def list_users():
    users = list(users_col.find({}, {"password": 0}))
    print(f"Total users: {len(users)}")
    for u in users:
        print(u)

def clear_db():
    print("Clearing users, profiles, requests, and skills...")
    users_col.delete_many({})
    profiles_col.delete_many({})
    requests_col.delete_many({})
    skills_col.delete_many({})
    print("Database cleared! All old credentials and data are gone.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "clear":
        clear_db()
    else:
        list_users()
