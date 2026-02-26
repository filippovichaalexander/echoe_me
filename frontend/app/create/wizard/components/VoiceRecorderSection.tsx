"use client";

import { RECORDING_MIN_SEC, RECORDING_MAX_SEC } from "../constants";
import React from "react";

export interface VoiceRecorderSectionProps {
  voice: {
    isRecordingVoice: boolean;
    voiceRecordingPaused: boolean;
    voiceDurationError: "short" | "long" | null;
    voiceFinalDurationSec: number | null;
    voicePausedDurationMs: number;
    voiceError: string | null;
    voiceUploading: boolean;
    voiceDraftBlob: Blob | null;
    voiceDraftPlaying: boolean;
    setVoiceDraftPlaying: (v: boolean) => void;
    voiceFinalBlob: Blob | null;
    voiceDraftUrl: string | null;
    voiceFinalUrl: string | null;
    voiceDraftAudioRef: React.RefObject<HTMLAudioElement | null>;
    startVoiceRecording: (append?: boolean) => void;
    pauseVoiceRecording: () => void;
    cancelPausedRecording: () => void;
    playPausedChunks: () => void;
    continueFromDraft: () => void;
    voiceDraftPlayPause: () => void;
    voiceFinalRemove: () => void;
    clearDraftAndChunks: () => void;
  };
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceRecorderSection({ voice: v }: VoiceRecorderSectionProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        Голосовая запись: не менее {RECORDING_MIN_SEC} с, не более {RECORDING_MAX_SEC} с.
      </p>

      {/* Черновик записи */}
      {v.voiceDraftBlob && v.voiceDraftUrl && !v.voiceFinalBlob && (
        <div className="rounded-xl border border-gray-600 bg-gray-900/50 p-3 space-y-2">
          <p className="text-xs text-gray-400">Запись сохранена. Можно продолжить запись или удалить.</p>
          <audio
            ref={v.voiceDraftAudioRef as React.RefObject<HTMLAudioElement>}
            src={v.voiceDraftUrl}
            onEnded={() => v.setVoiceDraftPlaying(false)}
            onPause={() => v.setVoiceDraftPlaying(false)}
            onPlay={() => v.setVoiceDraftPlaying(true)}
            className="hidden"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={v.voiceDraftPlayPause}
              className="rounded-xl px-4 py-2 font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
            >
              {v.voiceDraftPlaying ? "⏸ Пауза" : "▶ Воспроизвести"}
            </button>
            <button
              type="button"
              onClick={v.continueFromDraft}
              className="rounded-xl px-4 py-2 font-medium bg-green-600 hover:bg-green-500 text-white transition"
            >
              ▶ Продолжить запись
            </button>
            <button
              type="button"
              onClick={v.clearDraftAndChunks}
              className="rounded-xl px-4 py-2 font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
              title="Удалить запись"
            >
              Удаление
            </button>
          </div>
        </div>
      )}

      {/* Финальная запись */}
      {v.voiceFinalBlob && v.voiceFinalUrl && (
        <div className="rounded-xl border border-gray-600 bg-gray-900/50 p-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <span className="text-sm text-gray-300 shrink-0">
              Голосовая запись{v.voiceFinalDurationSec != null ? ` (${formatDuration(v.voiceFinalDurationSec)})` : ""}
            </span>
            <audio src={v.voiceFinalUrl} controls className="h-8 max-w-full" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              v.voiceFinalRemove();
            }}
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
            title="Удалить запись"
            aria-label="Удалить запись"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}

      {/* Пауза */}
      {v.voiceRecordingPaused && !v.voiceDraftBlob && !v.voiceFinalBlob && (
        <div
          className={`rounded-xl border p-3 flex flex-wrap items-center gap-2 ${
            v.voiceDurationError ? "border-red-500/70 bg-red-900/20" : "border-gray-600 bg-gray-900/50"
          }`}
        >
          <p className="text-xs text-gray-400 w-full">
            Запись приостановлена
            {v.voicePausedDurationMs > 0 ? ` · ${formatDuration(v.voicePausedDurationMs / 1000)}` : ""}. Прослушать,
            продолжить или удалить.
          </p>
          {v.voiceDurationError && (
            <p className="text-sm text-red-400 w-full font-medium" role="alert">
              {v.voiceDurationError === "short"
                ? `Аудиозапись слишком короткая (минимум ${RECORDING_MIN_SEC} с). Запишите дольше или удалите.`
                : `Аудиозапись слишком длинная (максимум ${RECORDING_MAX_SEC} с). Удалите и запишите короче.`}
            </p>
          )}
          <button
            type="button"
            onClick={v.playPausedChunks}
            className="rounded-xl px-4 py-2 font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
          >
            ▶ Воспроизвести
          </button>
          <button
            type="button"
            onClick={() => v.startVoiceRecording(true)}
            className="rounded-xl px-4 py-2 font-medium bg-green-600 hover:bg-green-500 text-white transition"
          >
            ▶ Продолжить запись
          </button>
          <button
            type="button"
            onClick={v.cancelPausedRecording}
            className="rounded-xl px-4 py-2 font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
            title="Удалить запись"
          >
            Удаление
          </button>
        </div>
      )}

      {/* Кнопка начала записи */}
      {!v.voiceFinalBlob && !v.voiceDraftBlob && !v.voiceRecordingPaused && !v.isRecordingVoice && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={v.voiceUploading}
            onClick={() => v.startVoiceRecording(false)}
            className={`rounded-xl px-4 py-2 font-medium transition flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 ${
              v.voiceUploading ? "opacity-50 pointer-events-none" : ""
            }`}
            title="Записать голосом с устройства"
          >
            🎤 Записать голосом
          </button>
          {v.voiceError && (
            <p className="text-xs text-red-400" role="alert">
              {v.voiceError}
            </p>
          )}
        </div>
      )}

      {/* Состояние «идёт запись» */}
      {v.isRecordingVoice && !v.voiceDraftBlob && !v.voiceFinalBlob && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-xl px-4 py-2 font-medium bg-red-600/80 text-white flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden />
            Идёт запись…
          </span>
          <button
            type="button"
            onClick={v.pauseVoiceRecording}
            className="rounded-xl px-4 py-2 font-medium bg-amber-600 hover:bg-amber-500 text-white transition"
          >
            Приостановить
          </button>
          {v.voiceError && (
            <p className="text-xs text-red-400" role="alert">
              {v.voiceError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

