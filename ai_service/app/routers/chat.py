import os
import psycopg2
from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services import claude_client, context_builder

router = APIRouter()


def _get_chapters_up_to(book_id: str, current_chapter: int) -> list[dict]:
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT chapter_number, title, content FROM chapters "
                "WHERE book_id = %s AND chapter_number <= %s ORDER BY chapter_number",
                (book_id, current_chapter),
            )
            rows = cur.fetchall()
            return [{"chapter_number": r[0], "title": r[1], "content": r[2]} for r in rows]
    finally:
        conn.close()


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    try:
        chapters = _get_chapters_up_to(req.book_id, req.current_chapter)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if not chapters:
        raise HTTPException(status_code=404, detail="No chapters found for this book up to the current chapter")

    context = context_builder.build_reading_context(chapters, req.current_chapter)

    system = (
        f"You are a helpful reading companion for a book the user is currently reading.\n"
        f"You have access ONLY to the book content up to and including Chapter {req.current_chapter}.\n"
        f"Do NOT reveal or hint at any events from chapters after Chapter {req.current_chapter}.\n"
        f"Do NOT use any knowledge outside this book's content.\n"
        f"Answer questions clearly, helpfully, and at an accessible reading level.\n"
        f"If asked about something beyond the current chapter, politely say you can only discuss what has been read so far.\n\n"
        f"BOOK CONTENT (Chapters 1 through {req.current_chapter}):\n{context}"
    )

    try:
        response = claude_client.ask(system, req.question, max_tokens=1024)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    return ChatResponse(response=response)
