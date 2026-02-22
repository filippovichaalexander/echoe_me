"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { saveVoiceToStorage, loadVoiceFromStorage, clearVoiceFromStorage } from "./voiceStorage";
import type { WizardProject } from "./types";

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceRecognitionRef = useRef<{ stop(): void } | null>(null);
  const voiceTranscriptRef = useRef<string>("");
  const voiceDraftAudioRef = useRef<HTMLAudioElement | null>(null);

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
      return () => {
        URL.revokeObjectURL(url);
        setVoiceFinalUrl(null);
      };
    }
    setVoiceFinalUrl(null);
  }, [voiceFinalBlob]);

  useEffect(() => {
    if (!currentProject || step !== 0) return;
    const restored = loadVoiceFromStorage(currentProject.id);
    if (restored) setVoiceFinalBlob(restored);
  }, [currentProject?.id, step]);

  const startVoiceRecording = useCallback(async (appendToExisting = false) => {
    setVoiceError(null);
    if (!appendToExisting) {
      voiceChunksRef.current = [];
      voiceTranscriptRef.current = "";
    }
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
    };
    mr.stop();
  }, []);

  /** Отменить приостановленную запись: очистить чанки и выйти из состояния паузы */
  const cancelPausedRecording = useCallback(() => {
    voiceChunksRef.current = [];
    setVoiceRecordingPaused(false);
    setVoiceError(null);
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
    voiceChunksRef.current = [];
    if (currentProject) clearVoiceFromStorage(currentProject.id);
  }, [currentProject]);

  /** После успешной отправки записи на сервер — сохранить blob в UI и хранилище, сбросить паузу/черновик/чанки */
  const onUploadSuccess = useCallback(
    (blob: Blob) => {
      setVoiceFinalBlob(blob);
      setVoiceDraftBlob(null);
      setVoiceRecordingPaused(false);
      setIsRecordingVoice(false);
      voiceChunksRef.current = [];
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

  return {
    isRecordingVoice,
    voiceRecordingPaused,
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
  };
}
