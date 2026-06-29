export interface Book {
  id: string;
  title: string;
  total_pages: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  content: string;
  summary: string | null;
}

export interface ChapterMeta {
  id: string;
  chapter_number: number;
  title: string;
  summary: string | null;
}

export interface Conversation {
  id: string;
  chapter_id: string | null;
  question: string;
  response: string;
  created_at: string;
}

export interface UploadResult {
  bookId: string;
  title: string;
  totalPages: number;
  chaptersDetected: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
