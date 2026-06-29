from pydantic import BaseModel
from typing import Optional


class ExtractRequest(BaseModel):
    book_id: str
    file_path: str


class ChapterOut(BaseModel):
    chapter_number: int
    title: str
    content: str


class ExtractResponse(BaseModel):
    title: str
    total_pages: int
    chapters: list[ChapterOut]


class ChatRequest(BaseModel):
    book_id: str
    question: str
    current_chapter: int


class ChatResponse(BaseModel):
    response: str


class ExplainRequest(BaseModel):
    book_id: str
    selected_text: str
    current_chapter: int


class ExplainResponse(BaseModel):
    explanation: str


class SummarizeChapterIn(BaseModel):
    chapter_id: str
    content: str


class SummarizeAllRequest(BaseModel):
    book_id: str
    chapters: list[SummarizeChapterIn]


class SummarySummary(BaseModel):
    chapter_id: str
    summary: str


class SummarizeAllResponse(BaseModel):
    summaries: list[SummarySummary]
