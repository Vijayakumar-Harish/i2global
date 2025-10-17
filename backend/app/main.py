from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Write Logger")

@app.get("/")
def writter():
    return {"writer":"logger"}


app.include_router(router)