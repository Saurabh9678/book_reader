'use client';

import { ChapterMeta } from '@/lib/types';

interface Props {
  chapters: ChapterMeta[];
  currentChapter: number;
  onChapterChange: (n: number) => void;
}

export default function ChapterNav({ chapters, currentChapter, onChapterChange }: Props) {
  const total = chapters.length;
  const canPrev = currentChapter > 1;
  const canNext = currentChapter < total;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs font-semibold uppercase text-gray-400 px-3 pt-3 pb-2 tracking-wider">Chapters</h3>
      <div className="flex-1 overflow-y-auto">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onChapterChange(ch.chapter_number)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg mx-1 mb-0.5 transition-colors ${
              ch.chapter_number === currentChapter
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xs text-gray-400 mr-2">{ch.chapter_number}.</span>
            {ch.title}
          </button>
        ))}
      </div>
      <div className="flex gap-2 p-3 border-t border-gray-100">
        <button
          onClick={() => onChapterChange(currentChapter - 1)}
          disabled={!canPrev}
          className="flex-1 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={() => onChapterChange(currentChapter + 1)}
          disabled={!canNext}
          className="flex-1 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
