from fastapi import APIRouter, HTTPException
from models.user import UserRegister, UserLogin
from services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):
    user_id = register_user(user.username, user.email, user.password)
    if not user_id:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "Registration successful", "user_id": user_id}

@router.post("/login")
def login(user: UserLogin):
    token = login_user(user.email, user.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "token": token}