import axios from 'axios';
import { ExtractResponse, ChatResponse, ExplainResponse } from '../types';

const client = axios.create({
  baseURL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  timeout: 120000,
});

export async function extractPdf(bookId: string, filePath: string): Promise<ExtractResponse> {
  const { data } = await client.post<ExtractResponse>('/extract', { book_id: bookId, file_path: filePath });
  return data;
}

export async function chat(
  bookId: string,
  question: string,
  currentChapter: number
): Promise<ChatResponse> {
  const { data } = await client.post<ChatResponse>('/chat', {
    book_id: bookId,
    question,
    current_chapter: currentChapter,
  });
  return data;
}

export async function explain(
  bookId: string,
  selectedText: string,
  currentChapter: number
): Promise<ExplainResponse> {
  const { data } = await client.post<ExplainResponse>('/explain', {
    book_id: bookId,
    selected_text: selectedText,
    current_chapter: currentChapter,
  });
  return data;
}

export async function summarizeAll(
  bookId: string,
  chapters: Array<{ chapter_id: string; content: string }>
): Promise<void> {
  await client.post('/summarize-all', { book_id: bookId, chapters });
}
