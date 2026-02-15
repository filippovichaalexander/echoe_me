"use client";

import { useRef, useState } from "react";

export default function MusicPlayer({ audioUrl }: { audioUrl: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!audioUrl) {
    return (
      <div className="rounded-xl bg-gray-700/50 p-4 text-gray-400">
        Аудио пока не сгенерировано (интеграция Stable Audio — в разработке).
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-xl bg-gray-700/50 p-4">
      <audio ref={ref} src={audioUrl} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <button
        type="button"
        onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}
        className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500"
      >
        {playing ? "⏸" : "▶"}
      </button>
      <span className="text-sm text-gray-400">Воспроизведение</span>
    </div>
  );
}
