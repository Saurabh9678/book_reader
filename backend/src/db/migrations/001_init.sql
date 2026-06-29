CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE books (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  file_path   TEXT NOT NULL,
  total_pages INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chapters (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id        UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title          TEXT NOT NULL,
  content        TEXT NOT NULL,
  summary        TEXT,
  UNIQUE (book_id, chapter_number)
);

CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  question   TEXT NOT NULL,
  response   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chapters_book_id ON chapters(book_id);
CREATE INDEX idx_conversations_book_id ON conversations(book_id);
