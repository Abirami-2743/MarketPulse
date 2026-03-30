import bcrypt
import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY
from database import db

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

def create_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def register_user(username: str, email: str, password: str):
    existing = db["users"].find_one({"email": email})
    if existing:
        return None
    hashed = hash_password(password)
    user = {"username": username, "email": email, "password": hashed}
    result = db["users"].insert_one(user)
    return str(result.inserted_id)

def login_user(email: str, password: str):
    user = db["users"].find_one({"email": email})
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    token = create_token(str(user["_id"]))
    return token