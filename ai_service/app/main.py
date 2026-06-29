from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

from app.routers import extract, chat, summarize, explain

app = FastAPI(title="Book Companion AI Service")

app.include_router(extract.router)
app.include_router(chat.router)
app.include_router(explain.router)
app.include_router(summarize.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
