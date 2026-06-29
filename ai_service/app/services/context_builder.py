MAX_CONTEXT_CHARS = 80_000


def build_reading_context(chapters: list[dict], current_chapter: int) -> str:
    allowed = [c for c in chapters if c["chapter_number"] <= current_chapter]
    parts = []
    for c in allowed:
        parts.append(f"=== Chapter {c['chapter_number']}: {c['title']} ===\n{c['content']}")
    combined = "\n\n".join(parts)
    return combined[:MAX_CONTEXT_CHARS]
