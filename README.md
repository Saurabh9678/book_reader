# Book Companion AI

An AI-powered reading companion that transforms any PDF book into an interactive experience. Upload a book, read it chapter by chapter, ask questions, hear it narrated aloud, and get plain-English explanations of difficult passages — all powered by Azure OpenAI.

---

## Features

- **PDF Upload** — Upload any PDF up to 100MB. The app automatically detects chapters and splits the content.
- **Chapter Reader** — Navigate chapters with a sidebar, track your progress, and read in a clean focused view.
- **AI Chat** — Ask questions about the book. The AI only knows what you've read so far — no spoilers.
- **Explain Simply** — Select any passage and get a plain-English explanation written for a general audience.
- **Text-to-Speech** — Listen to any chapter narrated by your browser with adjustable speed.
- **Chapter Summaries** — Each chapter gets a concise AI-generated summary, ready when you need it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| AI Service | Python, FastAPI |
| AI Model | Azure OpenAI (GPT-4) |
| Database | PostgreSQL |
| PDF Parsing | PyMuPDF |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
book_reader/
├── docker-compose.yml
├── .env.example
├── frontend/          # Next.js 15 app
├── backend/           # Express API
├── ai_service/        # FastAPI + Azure OpenAI
└── uploads/           # PDF storage (created by Docker)
```

---

## Getting Started

See [START.md](./START.md) for the full setup guide.

**Quick start:**

```bash
cp .env.example .env
# Fill in your Azure OpenAI credentials in .env
docker compose up --build
# Open http://localhost:3000
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | Local database username (set to anything) |
| `POSTGRES_PASSWORD` | Local database password (set to anything) |
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | Your Azure OpenAI endpoint URL |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Your model deployment name (e.g. `gpt-4`) |
| `AZURE_OPENAI_API_VERSION` | API version (default: `2024-02-01`) |

---

## How It Works

1. **Upload** — PDF is saved to disk and sent to the AI service for text extraction and chapter detection.
2. **Chapter Detection** — PyMuPDF scans for chapter headings. If none are found, the book is split into equal sections.
3. **Summaries** — Chapter summaries are generated in the background immediately after upload.
4. **Chat** — When you ask a question, the AI receives only the chapters you've read so far. Future chapters are never included in the context, enforcing the no-spoiler rule at the data level, not just via prompt instructions.
5. **Explain** — Selected text is sent to the AI with instructions to explain it simply. The response is shown in a popover and is not saved to chat history.
6. **TTS** — Narration runs entirely in the browser using the Web Speech API. No audio is sent to any server.

---

## API Endpoints

### Backend (port 4000)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/books/upload` | Upload a PDF |
| GET | `/api/books` | List all books |
| GET | `/api/books/:id` | Get book details |
| GET | `/api/books/:id/chapters` | List chapters |
| GET | `/api/books/:id/chapters/:n` | Get chapter content |
| POST | `/api/books/:id/conversations` | Ask a question |
| GET | `/api/books/:id/conversations` | Get chat history |
| POST | `/api/books/:id/explain` | Explain selected text |

---

## License

MIT
