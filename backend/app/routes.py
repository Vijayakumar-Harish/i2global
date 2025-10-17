from fastapi import APIRouter, HTTPException
from .schemas import UserCreate
from .models import create_user

router = APIRouter()

@router.post("/auth/signup", status_code=201)
async def signup(payload: UserCreate):
    existing = False
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await create_user(payload.user_name, payload.user_email, payload.password)
    return {"user_id":user["user_id"], "user_name":user["user_name"], "user_email":["user_email"]}