from .database import writer_collection, logger_collection
from typing import Optional
from datetime import datetime
async def create_user(user_name, user_email, password):
    user={
        "user_id": 1,
        "user_name": user_name,
        "user_email": user_email,
        "password": password,
        "create_on": datetime.now(),
        "last_update": datetime.now()
    }
    await writer_collection.insert_one(user)
    user.pop("password")
    return user