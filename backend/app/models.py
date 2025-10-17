from .database import writer_collection, logger_collection
from .utils import now, new_uuid
from .auth import hash_password, verify_password
from typing import Optional

async def create_user(user_name, user_email, password):
    user = {
        "user_id": new_uuid(),
        "user_name": user_name,
        "user_email": user_email,
        "password": hash_password(password),
        "create_on": now(),
        "last_update": now()
    }
    await writer_collection.insert_one(user)
    user.pop("password")
    return user

async def get_user_by_email(email):
    return await writer_collection.find_one({"user_email": email})

async def get_user_by_id(user_id):
    return await writer_collection.find_one({"user_id": user_id})

async def create_note(title, content):
    note = {
        "note_id": new_uuid(),
        "note_title": title,
        "note_content": content,
        "created_on": now(),
        "last_update": now()
    }
    await logger_collection.insert_one(note)
    return note

async def update_note(note_id, title, content):
    res = await logger_collection.update_one(
        {"note_id": note_id},
        {"$set": {"note_title": title, "note_content": content, "last_update": now()}}
    )
    if res.modified_count:
        return await logger_collection.find_one({"note_id": note_id})
    return None

async def delete_note(note_id):
    res = await logger_collection.delete_one({"note_id": note_id})
    return res.deleted_count > 0

async def list_notes(skip=0, limit=50):
    cursor = logger_collection.find().sort("last_update", -1).skip(skip).limit(limit)
    return await cursor.to_list(length=limit)

async def get_note(note_id):
    return await logger_collection.find_one({"note_id": note_id})
