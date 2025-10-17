from fastapi import APIRouter, HTTPException, Depends, Header
from .schemas import UserCreate, Token, NoteIn
from .models import create_user, get_user_by_email, create_note, list_notes, get_note, update_note, delete_note
from .auth import verify_password, create_access_token, decode_token
from typing import Optional
from datetime import timedelta

router = APIRouter()

def get_current_user(auth_header: Optional[str] = Header(None)):
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    scheme, _, token = auth_header.partition(" ")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@router.post("/auth/signup", status_code=201)
async def signup(payload: UserCreate):
    existing = await get_user_by_email(payload.user_email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await create_user(payload.user_name, payload.user_email, payload.password)
    return {"user_id": user["user_id"], "user_name": user["user_name"], "user_email": user["user_email"]}

@router.post("/auth/signin", response_model=Token)
async def signin(payload: UserCreate):
    user = await get_user_by_email(payload.user_email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"user_id": user["user_id"], "user_email": user["user_email"]})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/notes", status_code=201)
async def create_new_note(payload: NoteIn, current=Depends(get_current_user)):
    owner_id = current["user_id"]
    note = await create_note(owner_id, payload.note_title, payload.note_content)
    return note

@router.get("/notes")
async def get_notes(current=Depends(get_current_user)):
    owner_id = current["user_id"]
    notes = await list_notes(owner_id)
    return notes

@router.get("/notes/{note_id}")
async def read_note(note_id: str, current=Depends(get_current_user)):
    owner_id = current["user_id"]
    note = await get_note(note_id, owner_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/notes/{note_id}")
async def edit_note(note_id: str, payload: NoteIn, current=Depends(get_current_user)):
    owner_id = current["user_id"]
    note = await update_note(note_id, owner_id, payload.note_title, payload.note_content)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found or not updated")
    return note

@router.delete("/notes/{note_id}", status_code=204)
async def remove_note(note_id: str, current=Depends(get_current_user)):
    owner_id = current["user_id"]
    ok = await delete_note(note_id, owner_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"detail": "deleted"}