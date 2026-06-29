'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';

interface Props {
  bookId: string;
  currentChapter: number;
}

export default function ChatPanel({ bookId, currentChapter }: Props) {
  const { messages, isLoading, error, ask } = useChat(bookId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function submit() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    await ask(text, currentChapter);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Ask the AI</h2>
        <p className="text-xs text-gray-400">Questions answered from this book only</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">Ask anything about what you've read so far.</p>
            <div className="mt-4 flex flex-col gap-2">
              {['Summarize this chapter', 'Who are the main characters?', 'What just happened?'].map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s, currentChapter)}
                  className="text-xs text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-500 text-center mb-2">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question… (Enter to send)"
            rows={2}
            className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={submit}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
