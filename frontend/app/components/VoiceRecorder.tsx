"use client";

import { useState, useCallback } from "react";

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, analysis: { transcription?: string; emotion?: string }) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);

  const startRecording = useCallback(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setSupported(false);
      return;
    }
    setRecording(true);
    // TODO: реальная запись через MediaRecorder и отправка на /api/voice/analyze
  }, []);

  const stopRecording = useCallback(() => {
    setRecording(false);
    onRecordingComplete?.(new Blob(), { transcription: "", emotion: "neutral" });
  }, [onRecordingComplete]);

  if (!supported) {
    return <p className="text-gray-500 text-sm">Голосовой ввод не поддерживается в этом браузере.</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`rounded-xl px-4 py-2 font-medium ${
          recording ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        {recording ? "⏹ Остановить" : "🎤 Записать голосом"}
      </button>
    </div>
  );
}
