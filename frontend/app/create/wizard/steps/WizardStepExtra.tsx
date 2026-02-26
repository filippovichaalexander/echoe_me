 "use client";

import { useCallback, useRef, useState } from "react";
import { EXTRA_TEXT_ACCEPT, MAX_EXTRA_TEXT_FILES, validateExtraTextFileCritical } from "../validation";
import { EXTRA_WISHES } from "../constants";
import { VoiceRecorderSection, VoiceRecorderSectionProps } from "../components/VoiceRecorderSection";
import { PromptTextarea } from "../components/PromptTextarea";

export interface ExtraTextFile {
  id: string;
  name: string;
  size: number;
  path?: string;
}

export interface WizardStepExtraProps {
  getSet: (key: string, subKey?: string) => string;
  setValue: (key: string, value: unknown, subKey?: string) => void;
  getList: (key: string) => string[];
  toggleList: (key: string, item: string) => void;
  voice: VoiceRecorderSectionProps["voice"];
  extraTextFiles: ExtraTextFile[];
  setExtraTextFiles: React.Dispatch<React.SetStateAction<ExtraTextFile[]>>;
  extraTextFileError: string | null;
  setExtraTextFileError: (v: string | null) => void;
  extraTextUploading: boolean;
  extraTextFileInputRef: React.RefObject<HTMLInputElement | null>;
  onUploadTextFile: (file: File) => Promise<void>;
}

export function WizardStepExtra({
  getSet,
  setValue,
  getList,
  toggleList,
  voice,
  extraTextFiles,
  setExtraTextFiles,
  extraTextFileError,
  setExtraTextFileError,
  extraTextUploading,
  extraTextFileInputRef,
  onUploadTextFile,
}: WizardStepExtraProps) {
  const [speechActive, setSpeechActive] = useState(false);
  const speechRef = useRef<{ stop(): void } | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      setExtraTextFileError(null);
      if (!f) return;
      const err = validateExtraTextFileCritical(f);
      if (err) {
        setExtraTextFileError(err);
        return;
      }
      if (extraTextFiles.length >= MAX_EXTRA_TEXT_FILES) {
        setExtraTextFileError(`Максимум ${MAX_EXTRA_TEXT_FILES} файла(ов)`);
        return;
      }
      await onUploadTextFile(f);
    },
    [extraTextFiles.length, onUploadTextFile, setExtraTextFileError]
  );

  const extraText = getSet("extra", "text");

  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">✨ Особые пожелания</p>
      <div className="flex flex-wrap gap-2">
        {EXTRA_WISHES.map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={getList("extra_wishes").includes(opt)} onChange={() => toggleList("extra_wishes", opt)} className="rounded border-gray-600 bg-gray-900 text-purple-500" />
            <span className="text-sm text-gray-300">{opt}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-gray-300 text-sm">Текстовое описание (промпт)</p>
        <PromptTextarea
          value={extraText}
          onChange={(v) => setValue("extra", v, "text")}
          maxLength={300}
          recommendedMin={10}
          placeholder="Опишите дополнительные пожелания к результату..."
          disabled={!!voice.voiceFinalBlob || !!voice.voiceDraftBlob || voice.isRecordingVoice || voice.voiceRecordingPaused}
        />
        {extraTextFileError && (
          <p className="text-xs text-red-400" role="alert">
            {extraTextFileError}
          </p>
        )}
        {extraTextFiles.length > 0 && (
          <ul className="space-y-1">
            {extraTextFiles.map(({ id, name, size }) => (
              <li key={id} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="truncate">{name}</span>
                <span className="text-gray-500 shrink-0">{size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`}</span>
                <button type="button" onClick={() => setExtraTextFiles((p) => p.filter((x) => x.id !== id))} className="text-gray-500 hover:text-red-400 shrink-0" aria-label="Удалить">
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <VoiceRecorderSection voice={voice} />
    </div>
  );
}
