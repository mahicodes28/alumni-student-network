from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True)
db = client["alumni_network"]

# Collections
users_col = db["users"]
profiles_col = db["profiles"]
requests_col = db["requests"]
messages_col = db["messages"]
