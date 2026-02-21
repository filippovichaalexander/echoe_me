"use client";

import { EXTRA_TEXT_ACCEPT, MAX_EXTRA_TEXT_FILES, validateExtraTextFileCritical } from "../validation";
import { EXTRA_WISHES } from "../constants";

export interface ExtraTextFile {
  id: string;
  name: string;
  size: number;
  path?: string;
}

export interface WizardStepExtraProps {
  getList: (key: string) => string[];
  toggleList: (key: string, item: string) => void;
  extraTextFiles: ExtraTextFile[];
  setExtraTextFiles: React.Dispatch<React.SetStateAction<ExtraTextFile[]>>;
  extraTextFileError: string | null;
  setExtraTextFileError: (v: string | null) => void;
  extraTextUploading: boolean;
  extraTextFileInputRef: React.RefObject<HTMLInputElement | null>;
  onUploadTextFile: (file: File) => Promise<void>;
}

export function WizardStepExtra({
  getList,
  toggleList,
  extraTextFiles,
  setExtraTextFiles,
  extraTextFileError,
  setExtraTextFileError,
  extraTextUploading,
  extraTextFileInputRef,
  onUploadTextFile,
}: WizardStepExtraProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

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
      <p className="text-xs text-gray-500 mt-2">Текст/сэмплы (если есть):</p>
      <div className="space-y-2">
        <input ref={extraTextFileInputRef as React.RefObject<HTMLInputElement>} type="file" accept={EXTRA_TEXT_ACCEPT} className="hidden" onChange={handleFileChange} />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            disabled={extraTextUploading}
            onClick={() => extraTextFileInputRef.current?.click()}
            className="px-3 py-2 rounded-lg border border-gray-600 text-gray-400 hover:border-purple-500/50 text-sm disabled:opacity-50"
          >
            {extraTextUploading ? "Загрузка…" : "📎 Прикрепить файл с текстом"}
          </button>
          <button type="button" className="px-3 py-2 rounded-lg border border-gray-600 text-gray-400 hover:border-gray-500 text-sm">
            📝 Написать текст
          </button>
        </div>
        {extraTextFileError && (
          <p className="text-xs text-red-400" role="alert">
            {extraTextFileError}
          </p>
        )}
        <p className="text-xs text-gray-500">Форматы: .txt, .md, .rtf, .pdf (макс. 5–20 MB в зависимости от формата)</p>
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
    </div>
  );
}
