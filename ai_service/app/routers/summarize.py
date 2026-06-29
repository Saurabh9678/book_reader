import os
import psycopg2
from fastapi import APIRouter, HTTPException
from app.models.schemas import SummarizeAllRequest, SummarizeAllResponse, SummarySummary
from app.services import claude_client

router = APIRouter()

SUMMARY_SYSTEM = (
    "You are a book summarizer. Write a concise 3-5 sentence summary of the following chapter. "
    "Include the key events, ideas, or arguments. Do not editorialize or add outside information."
)


def _update_chapter_summary(chapter_id: str, summary: str) -> None:
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        with conn.cursor() as cur:
            cur.execute("UPDATE chapters SET summary = %s WHERE id = %s", (summary, chapter_id))
        conn.commit()
    finally:
        conn.close()


@router.post("/summarize-all", response_model=SummarizeAllResponse)
async def summarize_all(req: SummarizeAllRequest) -> SummarizeAllResponse:
    results: list[SummarySummary] = []

    for ch in req.chapters:
        content_excerpt = ch.content[:15_000]
        try:
            summary = claude_client.ask(SUMMARY_SYSTEM, content_excerpt, max_tokens=512)
            _update_chapter_summary(ch.chapter_id, summary)
            results.append(SummarySummary(chapter_id=ch.chapter_id, summary=summary))
        except Exception as e:
            print(f"Failed to summarize chapter {ch.chapter_id}: {e}")

    return SummarizeAllResponse(summaries=results)
