from fastapi import APIRouter, HTTPException
from app.models.schemas import ExplainRequest, ExplainResponse
from app.services import claude_client

router = APIRouter()

EXPLAIN_SYSTEM = (
    "You are a reading tutor helping a student understand a passage from a book.\n"
    "Explain the passage clearly as if talking to a 14-year-old.\n"
    "Use simple words, short sentences, and a friendly tone.\n"
    "Do not add information beyond what is in the passage itself.\n"
    "Keep your explanation to 2-4 sentences."
)


@router.post("/explain", response_model=ExplainResponse)
async def explain(req: ExplainRequest) -> ExplainResponse:
    if not req.selected_text.strip():
        raise HTTPException(status_code=400, detail="selected_text cannot be empty")

    prompt = f"Please explain this passage in simple terms:\n\n{req.selected_text}"

    try:
        explanation = claude_client.ask(EXPLAIN_SYSTEM, prompt, max_tokens=512)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    return ExplainResponse(explanation=explanation)
