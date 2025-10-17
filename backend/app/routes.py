from fastapi import APIRouter, HTTPException
from .schemas import UserCreate, NoteIn, NoteOut
from .models import create_user, get_user_by_email, create_note, list_notes, get_note, update_note, delete_note

router = APIRouter()

@router.post("/auth/signup", status_code=201)
async def signup(payload: UserCreate):
    existing = False
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await create_user(payload.user_name, payload.user_email, payload.password)
    return {"user_id":user["user_id"], "user_name":user["user_name"], "user_email":user["user_email"]}

@router.post("/auth/signin")
async def signin(payload: UserCreate):
    user = await get_user_by_email(payload.user_email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return "login successful"

@router.post("/notes", response_model=NoteOut, status_code=201)
async def create_new_note(payload:NoteIn):
    note = await create_note(1,payload.note_title, payload.note_content)
    note.pop("_id", None)
    return note

@router.get("/notes", response_model=list[NoteOut])
async def get_notes():
    notes = await list_notes(1)
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
    return {"detail":"deleted"}