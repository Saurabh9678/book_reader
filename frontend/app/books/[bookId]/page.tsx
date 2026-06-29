'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useReader } from '@/hooks/useReader';
import { useReaderStore } from '@/store/readerStore';
import { getBook } from '@/lib/api';
import BookReader from '@/components/BookReader';
import ChapterNav from '@/components/ChapterNav';
import ProgressBar from '@/components/ProgressBar';
import ChatPanel from '@/components/ChatPanel';

interface Props {
  params: Promise<{ bookId: string }>;
}

export default function ReaderPage({ params }: Props) {
  const { bookId } = use(params);
  const searchParams = useSearchParams();
  const initialChapter = parseInt(searchParams.get('chapter') || '1');

  const { setBook } = useReaderStore();
  const { currentChapter, totalChapters, chapterData, chapters, isLoading, error, setCurrentChapter } = useReader(
    bookId,
    initialChapter
  );

  useEffect(() => {
    getBook(bookId).then((book) => setBook(bookId, totalChapters, book.title));
  }, [bookId, totalChapters, setBook]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left sidebar: chapter nav */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-gray-100">
          <ProgressBar currentChapter={currentChapter} totalChapters={totalChapters} />
        </div>
        <div className="flex-1 overflow-hidden">
          <ChapterNav
            chapters={chapters}
            currentChapter={currentChapter}
            onChapterChange={setCurrentChapter}
          />
        </div>
      </aside>

      {/* Main reading area */}
      <main className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading chapter…</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : chapterData ? (
          <BookReader bookId={bookId} chapter={chapterData} />
        ) : null}
      </main>

      {/* Right sidebar: chat */}
      <aside className="w-80 bg-white border-l border-gray-100 flex flex-col flex-shrink-0">
        <ChatPanel bookId={bookId} currentChapter={currentChapter} />
      </aside>
    </div>
  );
}
