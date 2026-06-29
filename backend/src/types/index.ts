export interface Book {
  id: string;
  title: string;
  file_path: string;
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

export interface Conversation {
  id: string;
  book_id: string;
  chapter_id: string | null;
  question: string;
  response: string;
  created_at: string;
}

export interface ExtractedChapter {
  chapter_number: number;
  title: string;
  content: string;
}

export interface ExtractResponse {
  title: string;
  total_pages: number;
  chapters: ExtractedChapter[];
}

export interface ChatResponse {
  response: string;
}

export interface ExplainResponse {
  explanation: string;
}
