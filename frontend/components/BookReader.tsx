'use client';

import { useState } from 'react';
import { Chapter } from '@/lib/types';
import TTSControls from './TTSControls';
import ExplainButton from './ExplainButton';
import SummaryModal from './SummaryModal';

interface Props {
  bookId: string;
  chapter: Chapter;
}

export default function BookReader({ bookId, chapter }: Props) {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Chapter {chapter.chapter_number}</p>
          <h2 className="text-xl font-bold text-gray-900">{chapter.title}</h2>
        </div>
        <button
          onClick={() => setShowSummary(true)}
          className="text-xs text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Chapter Summary
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="prose prose-lg max-w-none prose-p:leading-relaxed prose-p:text-gray-700 select-text">
          {chapter.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>
      </div>

      <div className="px-6 py-3 border-t border-gray-100">
        <TTSControls text={chapter.content} />
      </div>

      <ExplainButton bookId={bookId} currentChapter={chapter.chapter_number} />

      {showSummary && (
        <SummaryModal
          bookId={bookId}
          chapterNumber={chapter.chapter_number}
          chapterTitle={chapter.title}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
