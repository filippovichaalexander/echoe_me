"use client";

import { DESCRIPTION_EXAMPLES, DESCRIPTION_MAX_LENGTH } from "../constants";
import { PromptTextarea } from "../components/PromptTextarea";
import { VoiceRecorderSection } from "../components/VoiceRecorderSection";

export interface WizardStepDescriptionProps {
  descriptionValue: string;
  onDescriptionChange: (value: string) => void;
  onStepNext: () => void;
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

export function WizardStepDescription({
  descriptionValue,
  onDescriptionChange,
  onStepNext,
  voice: v,
}: WizardStepDescriptionProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">📝 Опиши, что хочешь получить</p>
      <PromptTextarea
        value={descriptionValue}
        onChange={onDescriptionChange}
        maxLength={DESCRIPTION_MAX_LENGTH}
        recommendedMin={100}
        disabled={!!v.voiceFinalBlob || !!v.voiceDraftBlob || v.isRecordingVoice || v.voiceRecordingPaused}
        placeholder="Например: эпичный оркестр для трейлера..."
        onEnter={onStepNext}
      />
      <VoiceRecorderSection voice={v} />

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
