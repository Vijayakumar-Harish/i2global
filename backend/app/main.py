from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Writer Logger")

@app.get("/")
def writter():
    return {"writer":"logger"}


app.include_router(router)