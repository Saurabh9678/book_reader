import axios from 'axios';
import { Book, Chapter, ChapterMeta, Conversation, UploadResult } from './types';

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + '/api',
});

export async function uploadBook(file: File, onProgress?: (pct: number) => void): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<UploadResult>('/books/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data;
}

export async function listBooks(): Promise<Book[]> {
  const { data } = await api.get<Book[]>('/books');
  return data;
}

export async function getBook(bookId: string): Promise<Book> {
  const { data } = await api.get<Book>(`/books/${bookId}`);
  return data;
}

export async function listChapters(bookId: string): Promise<ChapterMeta[]> {
  const { data } = await api.get<ChapterMeta[]>(`/books/${bookId}/chapters`);
  return data;
}

export async function getChapter(bookId: string, chapterNumber: number): Promise<Chapter> {
  const { data } = await api.get<Chapter>(`/books/${bookId}/chapters/${chapterNumber}`);
  return data;
}

export async function sendMessage(
  bookId: string,
  question: string,
  currentChapter: number
): Promise<{ conversationId: string; response: string }> {
  const { data } = await api.post(`/books/${bookId}/conversations`, { question, currentChapter });
  return data;
}

export async function explainText(
  bookId: string,
  selectedText: string,
  currentChapter: number
): Promise<{ explanation: string }> {
  const { data } = await api.post(`/books/${bookId}/explain`, { selectedText, currentChapter });
  return data;
}

export async function getConversations(bookId: string): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>(`/books/${bookId}/conversations`);
  return data;
}
