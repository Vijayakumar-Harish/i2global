from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "writelogger")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]


writer_collection = db.get_collection("writer")
logger_collection = db.get_collection("logger")