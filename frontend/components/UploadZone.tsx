'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { uploadBook } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function validate(file: File): string | null {
    if (file.type !== 'application/pdf') return 'Only PDF files are accepted.';
    if (file.size > 100 * 1024 * 1024) return 'File is too large. Maximum size is 100MB.';
    return null;
  }

  async function handleFile(file: File) {
    const err = validate(file);
    if (err) { setError(err); return; }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadBook(file, setProgress);
      setUploading(false);
      setProcessing(true);
      router.push(`/books/${result.bookId}?chapter=1`);
    } catch {
      setError('Upload failed. Please try again.');
      setUploading(false);
      setProcessing(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Companion AI</h1>
        <p className="text-gray-500 mb-8">Upload a PDF book and read it with an AI companion.</p>

        <div
          className={`border-2 border-dashed rounded-xl p-12 cursor-pointer transition-colors ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-white'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={onChange} />

          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <p className="text-blue-600 font-medium">Uploading… {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : processing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
              <p className="text-green-600 font-medium">Processing chapters…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-700">Drop your PDF here</p>
              <p className="text-gray-400 text-sm">or click to browse — max 100MB</p>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
