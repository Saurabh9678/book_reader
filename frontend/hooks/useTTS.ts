'use client';

import { useState, useRef, useCallback } from 'react';

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRateState] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.onstart = () => { setSpeaking(true); setPaused(false); };
      utterance.onend = () => { setSpeaking(false); setPaused(false); };
      utterance.onerror = () => { setSpeaking(false); setPaused(false); };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, rate]
  );

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  const setRate = useCallback(
    (newRate: number) => {
      setRateState(newRate);
      if (speaking && utteranceRef.current) {
        const text = utteranceRef.current.text;
        stop();
        setTimeout(() => speak(text), 50);
      }
    },
    [speaking, stop, speak]
  );

  return { speaking, paused, rate, supported, speak, pause, resume, stop, setRate };
}
