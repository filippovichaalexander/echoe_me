/**
 * Аудио утилиты: нормализация, форматы, длительность.
 */

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function createAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new Ctx();
}
