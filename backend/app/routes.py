from fastapi import APIRouter, HTTPException
from .schemas import UserCreate, Token, NoteIn, UserLogin
from .models import create_user, get_user_by_email, create_note, list_notes, get_note, update_note, delete_note
from .auth import verify_password, create_access_token

router = APIRouter()

@router.post("/auth/signup", status_code=201)
async def signup(payload: UserCreate):
    existing = await get_user_by_email(payload.user_email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await create_user(payload.user_name, payload.user_email, payload.password)
    return {"user_id": user["user_id"], "user_name": user["user_name"], "user_email": user["user_email"]}

@router.post("/auth/signin", response_model=Token)
async def signin(payload: UserLogin):
    user = await get_user_by_email(payload.user_email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"user_id": user["user_id"], "user_email": user["user_email"]})
    return {"access_token": token, "token_type": "bearer"}

# ✅ TEMP: No user dependency
@router.post("/notes", status_code=201)
async def create_new_note(payload: NoteIn):
    note = await create_note(payload.note_title, payload.note_content)
    note.pop("_id", None)
    return note

@router.get("/notes")
async def get_notes():
    notes = await list_notes()
    for note in notes:
        note.pop("_id", None)
    return notes

@router.get("/notes/{note_id}")
async def read_note(note_id: str):
    note = await get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/notes/{note_id}")
async def edit_note(note_id: str, payload: NoteIn):
    note = await update_note(note_id, payload.note_title, payload.note_content)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found or not updated")
    return note

@router.delete("/notes/{note_id}", status_code=204)
async def remove_note(note_id: str):
    ok = await delete_note(note_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"detail": "deleted"}
