'use client';

import { useState } from 'react';
import { ChatMessage } from '@/lib/types';
import { sendMessage } from '@/lib/api';

export function useChat(bookId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(question: string, currentChapter: number) {
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    try {
      const result = await sendMessage(bookId, question, currentChapter);
      setMessages((prev) => [...prev, { role: 'assistant', content: result.response }]);
    } catch {
      setError('Failed to get a response. Please try again.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, isLoading, error, ask };
}
