'use client';

import { useTTS } from '@/hooks/useTTS';

interface Props {
  text: string;
}

const RATES = [0.75, 1, 1.25, 1.5, 2];

export default function TTSControls({ text }: Props) {
  const { speaking, paused, rate, supported, speak, pause, resume, stop, setRate } = useTTS();

  if (!supported) {
    return <p className="text-xs text-gray-400 text-center py-2">Text-to-speech not supported in this browser.</p>;
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {!speaking ? (
        <button
          onClick={() => speak(text)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play
        </button>
      ) : paused ? (
        <button
          onClick={resume}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          Resume
        </button>
      ) : (
        <button
          onClick={pause}
          className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Pause
        </button>
      )}

      {speaking && (
        <button
          onClick={stop}
          className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          Stop
        </button>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-xs text-gray-500">Speed:</span>
        {RATES.map((r) => (
          <button
            key={r}
            onClick={() => setRate(r)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              rate === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r}×
          </button>
        ))}
      </div>
    </div>
  );
}
