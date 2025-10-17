from fastapi import FastAPI
from .routes import router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Writer Logger")

@app.get("/")
def writter():
    return {"writer":"logger"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # your Next URL
    allow_credentials=True,                    # ← allow cookies / headers
    allow_methods=["*"],
    allow_headers=["*"],                       # ← Authorization is allowed
)

app.include_router(router)