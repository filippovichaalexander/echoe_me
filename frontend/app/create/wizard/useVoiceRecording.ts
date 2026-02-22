"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { saveVoiceToStorage, loadVoiceFromStorage, clearVoiceFromStorage } from "./voiceStorage";
import type { WizardProject } from "./types";
import { RECORDING_MIN_SEC, RECORDING_MAX_SEC } from "./constants";

export interface UseVoiceRecordingProps {
  currentProject: WizardProject | null;
  step: number;
  dataDescription: string;
  setValue: (key: string, value: unknown, subKey?: string) => void;
}

export function useVoiceRecording({ currentProject, step, dataDescription, setValue }: UseVoiceRecordingProps) {
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingPaused, setVoiceRecordingPaused] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceUploading, setVoiceUploading] = useState(false);
  const [voiceDraftBlob, setVoiceDraftBlob] = useState<Blob | null>(null);
  const [voiceDraftPlaying, setVoiceDraftPlaying] = useState(false);
  const [voiceFinalBlob, setVoiceFinalBlob] = useState<Blob | null>(null);
  const [voiceDraftUrl, setVoiceDraftUrl] = useState<string | null>(null);
  const [voiceFinalUrl, setVoiceFinalUrl] = useState<string | null>(null);
  const [voiceDurationError, setVoiceDurationError] = useState<"short" | "long" | null>(null);
  const [voiceFinalDurationSec, setVoiceFinalDurationSec] = useState<number | null>(null);
  const [voicePausedDurationMs, setVoicePausedDurationMs] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceRecognitionRef = useRef<{ stop(): void } | null>(null);
  const voiceTranscriptRef = useRef<string>("");
  const voiceDraftAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const totalRecordedMsRef = useRef<number>(0);

  useEffect(() => {
    if (voiceDraftBlob) {
      const url = URL.createObjectURL(voiceDraftBlob);
      setVoiceDraftUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setVoiceDraftUrl(null);
      };
    }
    setVoiceDraftUrl(null);
  }, [voiceDraftBlob]);

  useEffect(() => {
    if (voiceFinalBlob) {
      const url = URL.createObjectURL(voiceFinalBlob);
      setVoiceFinalUrl(url);
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setVoiceFinalDurationSec(audio.duration);
      };
      audio.onerror = () => setVoiceFinalDurationSec(null);
      return () => {
        URL.revokeObjectURL(url);
        setVoiceFinalUrl(null);
        setVoiceFinalDurationSec(null);
      };
    }
    setVoiceFinalUrl(null);
    setVoiceFinalDurationSec(null);
  }, [voiceFinalBlob]);

  useEffect(() => {
    if (!currentProject || step !== 0) return;
    const restored = loadVoiceFromStorage(currentProject.id);
    if (restored) setVoiceFinalBlob(restored);
  }, [currentProject?.id, step]);

  const startVoiceRecording = useCallback(async (appendToExisting = false) => {
    setVoiceError(null);
    setVoiceDurationError(null);
    if (!appendToExisting) {
      setVoicePausedDurationMs(0);
      voiceChunksRef.current = [];
      voiceTranscriptRef.current = "";
      totalRecordedMsRef.current = 0;
    }
    recordingStartTimeRef.current = Date.now();
    setVoiceRecordingPaused(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) voiceChunksRef.current.push(e.data);
      };
      mr.onstop = () => stream.getTracks().forEach((t) => t.stop());
      mr.start(200);
      setIsRecordingVoice(true);
      if (!appendToExisting) {
        const Win = typeof window !== "undefined" ? window : null;
        type RecInstance = {
          start(): void;
          stop(): void;
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: ((e: { results: unknown }) => void) | null;
        };
        const SR =
          Win &&
          ((Win as unknown as { SpeechRecognition?: new () => RecInstance }).SpeechRecognition ??
            (Win as unknown as { webkitSpeechRecognition?: new () => RecInstance }).webkitSpeechRecognition);
        if (SR) {
          try {
            const rec = new SR();
            voiceRecognitionRef.current = rec;
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = "ru-RU";
            rec.onresult = (e: { results: unknown }) => {
              const results = e.results as Iterable<{ [i: number]: { transcript: string } }>;
              voiceTranscriptRef.current = Array.from(results)
                .map((r) => r[0]?.transcript ?? "")
                .join(" ")
                .trim();
            };
            rec.start();
          } catch {
            voiceRecognitionRef.current = null;
          }
        }
      }
    } catch (e) {
      setVoiceError(e instanceof Error ? e.message : "Нет доступа к микрофону");
    }
  }, []);

  const pauseVoiceRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state === "inactive") {
      setIsRecordingVoice(false);
      return;
    }
    totalRecordedMsRef.current += Date.now() - recordingStartTimeRef.current;
    const rec = voiceRecognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        //
      }
    }
    mr.onstop = () => {
      setIsRecordingVoice(false);
      setVoiceRecordingPaused(true);
      const totalMs = totalRecordedMsRef.current;
      setVoicePausedDurationMs(totalMs);
      if (totalMs < RECORDING_MIN_SEC * 1000) setVoiceDurationError("short");
      else if (totalMs > RECORDING_MAX_SEC * 1000) setVoiceDurationError("long");
      else setVoiceDurationError(null);
    };
    mr.stop();
  }, []);

  /** Авто-пауза при достижении максимальной длительности записи (60 сек) */
  const pauseVoiceRecordingRef = useRef(pauseVoiceRecording);
  pauseVoiceRecordingRef.current = pauseVoiceRecording;
  useEffect(() => {
    if (!isRecordingVoice) return;
    const interval = setInterval(() => {
      const totalMs = totalRecordedMsRef.current + (Date.now() - recordingStartTimeRef.current);
      if (totalMs >= RECORDING_MAX_SEC * 1000) {
        pauseVoiceRecordingRef.current();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  /** Отменить приостановленную запись: очистить чанки и выйти из состояния паузы */
  const cancelPausedRecording = useCallback(() => {
    voiceChunksRef.current = [];
    totalRecordedMsRef.current = 0;
    recordingStartTimeRef.current = 0;
    setVoiceRecordingPaused(false);
    setVoiceError(null);
    setVoiceDurationError(null);
    setVoicePausedDurationMs(0);
  }, []);

  /** Воспроизвести записанные чанки в состоянии «приостановлено» (без перехода в черновик) */
  const playPausedChunks = useCallback(() => {
    const chunks = voiceChunksRef.current;
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    audio.onerror = () => URL.revokeObjectURL(url);
    audio.play().catch(() => URL.revokeObjectURL(url));
  }, []);

  const continueFromDraft = useCallback(() => {
    setVoiceDraftBlob(null);
    startVoiceRecording(true);
  }, [startVoiceRecording]);

  const voiceDraftPlayPause = useCallback(() => {
    const el = voiceDraftAudioRef.current;
    if (!el) return;
    if (voiceDraftPlaying) {
      el.pause();
      setVoiceDraftPlaying(false);
    } else {
      el.play();
      setVoiceDraftPlaying(true);
    }
  }, [voiceDraftPlaying]);

  /** Полностью удалить запись шага 2: вернуть к изначальному состоянию (финал, черновик, пауза, чанки, хранилище). */
  const voiceFinalRemove = useCallback(() => {
    setVoiceFinalBlob(null);
    setVoiceDraftBlob(null);
    setVoiceDraftPlaying(false);
    setVoiceRecordingPaused(false);
    setIsRecordingVoice(false);
    setVoiceError(null);
    setVoiceDurationError(null);
    setVoiceFinalDurationSec(null);
    setVoicePausedDurationMs(0);
    voiceChunksRef.current = [];
    totalRecordedMsRef.current = 0;
    recordingStartTimeRef.current = 0;
    if (currentProject) clearVoiceFromStorage(currentProject.id);
  }, [currentProject]);

  /** После успешной отправки записи на сервер — сохранить blob в UI и хранилище, сбросить паузу/черновик/чанки */
  const onUploadSuccess = useCallback(
    (blob: Blob) => {
      setVoiceFinalBlob(blob);
      setVoiceDraftBlob(null);
      setVoiceRecordingPaused(false);
      setIsRecordingVoice(false);
      setVoiceDurationError(null);
      setVoicePausedDurationMs(0);
      voiceChunksRef.current = [];
      totalRecordedMsRef.current = 0;
      recordingStartTimeRef.current = 0;
      if (currentProject) saveVoiceToStorage(blob, currentProject.id);
    },
    [currentProject]
  );

  const clearDraftAndChunks = useCallback(() => {
    voiceChunksRef.current = [];
    setVoiceDraftBlob(null);
  }, []);

  /** Blob для отправки: финал, черновик или собранный из чанков при паузе */
  const getBlobToUpload = useCallback((): Blob | null => {
    if (voiceFinalBlob) return voiceFinalBlob;
    if (voiceDraftBlob) return voiceDraftBlob;
    const chunks = voiceChunksRef.current;
    if (voiceRecordingPaused && chunks.length > 0) return new Blob(chunks, { type: "audio/webm" });
    return null;
  }, [voiceFinalBlob, voiceDraftBlob, voiceRecordingPaused]);

  /** Текущая длительность записи в миллисекундах (для проверки мин/макс) */
  const getTotalDurationMs = useCallback((): number => {
    if (isRecordingVoice) return totalRecordedMsRef.current + (Date.now() - recordingStartTimeRef.current);
    return totalRecordedMsRef.current;
  }, [isRecordingVoice]);

  return {
    isRecordingVoice,
    voiceRecordingPaused,
    voiceDurationError,
    voiceFinalDurationSec,
    voicePausedDurationMs,
    voiceError,
    setVoiceError,
    voiceUploading,
    setVoiceUploading,
    voiceDraftBlob,
    voiceDraftPlaying,
    setVoiceDraftPlaying,
    voiceFinalBlob,
    voiceDraftUrl,
    voiceFinalUrl,
    voiceChunksRef,
    voiceDraftAudioRef,
    startVoiceRecording,
    pauseVoiceRecording,
    cancelPausedRecording,
    playPausedChunks,
    continueFromDraft,
    voiceDraftPlayPause,
    voiceFinalRemove,
    onUploadSuccess,
    clearDraftAndChunks,
    getBlobToUpload,
    getTotalDurationMs,
  };
}
