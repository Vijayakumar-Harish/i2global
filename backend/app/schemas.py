from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
# from uuid import UUID

class UserCreate(BaseModel):
    user_name: str = Field(..., min_length=5)
    user_email: EmailStr
    password: str = Field(..., min_length=8)

class UserOut(BaseModel):
    user_id: str
    user_name: str
    user_email: EmailStr
    create_on: datetime
    last_update: Optional[datetime]

class NoteIn(BaseModel):
    note_title: str
    note_content: str

class NoteOut(BaseModel):
    note_id: str
    note_title: str
    note_content: str
    created_on: datetime
    last_update: Optional[datetime]
    owner_id: str # from whom the notes is created (which is not in the requirement)