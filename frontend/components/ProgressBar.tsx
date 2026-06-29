'use client';

interface Props {
  currentChapter: number;
  totalChapters: number;
}

export default function ProgressBar({ currentChapter, totalChapters }: Props) {
  const pct = totalChapters > 0 ? Math.round((currentChapter / totalChapters) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Chapter {currentChapter} of {totalChapters}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
