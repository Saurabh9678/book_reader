'use client';

import { useState, useEffect, useRef } from 'react';
import { explainText } from '@/lib/api';

interface Props {
  bookId: string;
  currentChapter: number;
}

export default function ExplainButton({ bookId, currentChapter }: Props) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onSelectionChange() {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      if (!text || text.length < 10) {
        setPosition(null);
        setSelectedText('');
        return;
      }
      const range = selection!.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
      setSelectedText(text);
      setExplanation(null);
    }

    document.addEventListener('mouseup', onSelectionChange);
    return () => document.removeEventListener('mouseup', onSelectionChange);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPosition(null);
        setExplanation(null);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleExplain() {
    setLoading(true);
    try {
      const result = await explainText(bookId, selectedText, currentChapter);
      setExplanation(result.explanation);
    } catch {
      setExplanation('Failed to get explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!position) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-3 max-w-sm"
      style={{ top: position.top, left: Math.min(position.left, window.innerWidth - 360) }}
    >
      {!explanation ? (
        <button
          onClick={handleExplain}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
          Explain Simply
        </button>
      ) : (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Simple Explanation</p>
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}
