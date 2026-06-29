'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chapter, ChapterMeta } from '@/lib/types';
import { getChapter, listChapters } from '@/lib/api';

export function useReader(bookId: string, initialChapter: number) {
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<ChapterMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listChapters(bookId).then(setChapters).catch(console.error);
  }, [bookId]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getChapter(bookId, currentChapter)
      .then(setChapterData)
      .catch(() => setError('Failed to load chapter'))
      .finally(() => setIsLoading(false));
  }, [bookId, currentChapter]);

  const totalChapters = chapters.length;

  const nextChapter = useCallback(() => {
    if (currentChapter < totalChapters) setCurrentChapter((n) => n + 1);
  }, [currentChapter, totalChapters]);

  const prevChapter = useCallback(() => {
    if (currentChapter > 1) setCurrentChapter((n) => n - 1);
  }, [currentChapter]);

  return { currentChapter, totalChapters, chapterData, chapters, isLoading, error, nextChapter, prevChapter, setCurrentChapter };
}
