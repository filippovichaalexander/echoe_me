"use client";

import { DESCRIPTION_EXAMPLES } from "../constants";

export interface WizardStepDescriptionProps {
  descriptionValue: string;
  onDescriptionChange: (value: string) => void;
  onStepNext: () => void;
  voice: {
    isRecordingVoice: boolean;
    voiceRecordingPaused: boolean;
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
    finishPausedRecording: () => void;
    continueFromDraft: () => void;
    voiceDraftPlayPause: () => void;
    voiceFinalRemove: () => void;
    clearDraftAndChunks: () => void;
  };
}

export function WizardStepDescription({
  descriptionValue,
  onDescriptionChange,
  onStepNext,
  voice: v,
}: WizardStepDescriptionProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">📝 Опиши, что хочешь получить</p>
      <div className="relative">
        <input
          type="text"
          placeholder="Например: эпичный оркестр для трейлера..."
          className="w-full bg-gray-900 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 disabled:opacity-60 disabled:pointer-events-none"
          value={descriptionValue}
          onChange={(e) => onDescriptionChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onStepNext();
          }}
          disabled={!!v.voiceFinalBlob}
        />
      </div>

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

      {v.voiceFinalBlob && v.voiceFinalUrl && (
        <div className="rounded-xl border border-gray-600 bg-gray-900/50 p-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <span className="text-sm text-gray-300 shrink-0">Голосовая запись</span>
            <audio src={v.voiceFinalUrl} controls className="h-8 max-w-full" />
          </div>
          <button
            type="button"
            onClick={v.voiceFinalRemove}
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
            title="Удалить запись"
            aria-label="Удалить запись"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}

      {v.voiceRecordingPaused && !v.voiceDraftBlob && !v.voiceFinalBlob && (
        <div className="rounded-xl border border-gray-600 bg-gray-900/50 p-3 flex flex-wrap items-center gap-2">
          <p className="text-xs text-gray-400 w-full">Запись приостановлена. Продолжить или завершить.</p>
          <button type="button" onClick={() => v.startVoiceRecording(true)} className="rounded-xl px-4 py-2 font-medium bg-green-600 hover:bg-green-500 text-white transition">
            ▶ Продолжить запись
          </button>
          <button type="button" onClick={v.finishPausedRecording} className="rounded-xl px-4 py-2 font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 transition">
            Завершить запись
          </button>
        </div>
      )}

      {!v.voiceFinalBlob && !v.voiceDraftBlob && !v.voiceRecordingPaused && !v.isRecordingVoice && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={v.voiceUploading}
            onClick={() => v.startVoiceRecording(false)}
            className={`rounded-xl px-4 py-2 font-medium transition flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 ${v.voiceUploading ? "opacity-50 pointer-events-none" : ""}`}
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

      {v.isRecordingVoice && !v.voiceDraftBlob && !v.voiceFinalBlob && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-xl px-4 py-2 font-medium bg-red-600/80 text-white flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden />
            Идёт запись…
          </span>
          <button type="button" onClick={v.pauseVoiceRecording} className="rounded-xl px-4 py-2 font-medium bg-amber-600 hover:bg-amber-500 text-white transition">
            Приостановить
          </button>
          {v.voiceError && (
            <p className="text-xs text-red-400" role="alert">
              {v.voiceError}
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">Примеры:</p>
      <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
        {DESCRIPTION_EXAMPLES.map((ex) => (
          <li key={ex}>• {ex}</li>
        ))}
      </ul>
      <p className="text-xs text-gray-500">💡 Подсказка: Опиши жанр, атмосферу, инструменты, темп, ассоциации</p>
    </div>
  );
}
