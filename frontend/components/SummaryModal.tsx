'use client';

import { useState, useEffect } from 'react';
import { getChapter } from '@/lib/api';

interface Props {
  bookId: string;
  chapterNumber: number;
  chapterTitle: string;
  onClose: () => void;
}

export default function SummaryModal({ bookId, chapterNumber, chapterTitle, onClose }: Props) {
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      while (active) {
        try {
          const chapter = await getChapter(bookId, chapterNumber);
          if (chapter.summary) {
            if (active) setSummary(chapter.summary);
            return;
          }
        } catch {
          // ignore, keep polling
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    poll();
    return () => { active = false; };
  }, [bookId, chapterNumber]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Chapter Summary</p>
            <h3 className="text-lg font-semibold text-gray-900">{chapterTitle}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {summary ? (
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Generating summary…</p>
          </div>
        )}
      </div>
    </div>
  );
}
