"use client";

import { useState, useCallback, useRef } from "react";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setAudioRef = useCallback((el: HTMLAudioElement | null) => {
    audioRef.current = el;
    if (el) {
      el.addEventListener("timeupdate", () => setCurrentTime(el.currentTime));
      el.addEventListener("loadedmetadata", () => setDuration(el.duration));
      el.addEventListener("ended", () => setIsPlaying(false));
    }
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback((t: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setCurrentTime(t);
    }
  }, []);

  return { setAudioRef, isPlaying, currentTime, duration, play, pause, seek };
}
