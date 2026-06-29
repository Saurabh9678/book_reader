'use client';

import { create } from 'zustand';

interface ReaderStore {
  bookId: string | null;
  currentChapter: number;
  totalChapters: number;
  bookTitle: string;
  setBook: (bookId: string, totalChapters: number, title: string) => void;
  setChapter: (n: number) => void;
}

export const useReaderStore = create<ReaderStore>((set) => ({
  bookId: null,
  currentChapter: 1,
  totalChapters: 1,
  bookTitle: '',
  setBook: (bookId, totalChapters, title) => set({ bookId, totalChapters, bookTitle: title }),
  setChapter: (n) => set({ currentChapter: n }),
}));
