from fastapi import APIRouter, HTTPException
from app.models.schemas import ExtractRequest, ExtractResponse, ChapterOut
from app.services.pdf_parser import extract_and_detect_chapters
import os

router = APIRouter()


@router.post("/extract", response_model=ExtractResponse)
async def extract(req: ExtractRequest) -> ExtractResponse:
    if not os.path.exists(req.file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {req.file_path}")

    try:
        result = extract_and_detect_chapters(req.file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")

    chapters = [
        ChapterOut(
            chapter_number=ch["chapter_number"],
            title=ch["title"],
            content=ch["content"],
        )
        for ch in result["chapters"]
    ]

    return ExtractResponse(
        title=result["title"],
        total_pages=result["total_pages"],
        chapters=chapters,
    )
