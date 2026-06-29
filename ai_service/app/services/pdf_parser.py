import re
import fitz  # PyMuPDF
from pathlib import Path


def extract_and_detect_chapters(file_path: str) -> dict:
    doc = fitz.open(file_path)
    total_pages = len(doc)

    title = doc.metadata.get("title", "").strip()
    if not title:
        title = Path(file_path).stem.replace("_", " ").replace("-", " ").title()

    pages_text = []
    for page in doc:
        pages_text.append(page.get_text())

    full_text = "\n".join(pages_text)

    chapters = _detect_chapters(pages_text, total_pages)

    doc.close()
    return {"title": title, "total_pages": total_pages, "chapters": chapters}


def _detect_chapters(pages_text: list[str], total_pages: int) -> list[dict]:
    chapter_pattern = re.compile(
        r"^(Chapter|CHAPTER|Ch\.|PART|Part)\s+(\d+|[IVXLCDM]+)[:\s]*(.*)$",
        re.MULTILINE,
    )

    matches = []
    full_text_with_offsets = []
    char_offset = 0

    for page_num, page_text in enumerate(pages_text):
        full_text_with_offsets.append((char_offset, page_num, page_text))
        char_offset += len(page_text) + 1

    full_text = "\n".join(pages_text)

    for match in chapter_pattern.finditer(full_text):
        heading = match.group(0).strip()
        chapter_title_part = match.group(3).strip()
        pos = match.start()

        page_num = 0
        for offset, pnum, _ in full_text_with_offsets:
            if offset <= pos:
                page_num = pnum

        matches.append({"pos": pos, "page": page_num, "heading": heading, "extra_title": chapter_title_part})

    if len(matches) >= 2:
        chapters = []
        for i, m in enumerate(matches):
            start_pos = m["pos"]
            end_pos = matches[i + 1]["pos"] if i + 1 < len(matches) else len(full_text)
            content = full_text[start_pos:end_pos].strip()

            chapter_num = i + 1
            title_extra = m["extra_title"]
            heading_title = f"Chapter {chapter_num}" + (f": {title_extra}" if title_extra else "")

            chapters.append({
                "chapter_number": chapter_num,
                "title": heading_title,
                "content": content,
            })
        return chapters

    return _chunk_by_pages(pages_text, total_pages)


def _chunk_by_pages(pages_text: list[str], total_pages: int) -> list[dict]:
    chunk_size = max(10, total_pages // 20) if total_pages > 20 else total_pages
    chapters = []
    chapter_num = 1

    for i in range(0, total_pages, chunk_size):
        chunk_pages = pages_text[i : i + chunk_size]
        content = "\n".join(chunk_pages).strip()
        if not content:
            continue
        chapters.append({
            "chapter_number": chapter_num,
            "title": f"Section {chapter_num}",
            "content": content,
        })
        chapter_num += 1

    if not chapters:
        full = "\n".join(pages_text).strip()
        chapters.append({"chapter_number": 1, "title": "Full Text", "content": full})

    return chapters
