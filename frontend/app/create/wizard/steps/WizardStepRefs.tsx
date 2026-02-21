"use client";

import { validateRefUrl, REFS_ACCEPT, MAX_REFS_LINKS, MAX_REF_FILES, validateRefsFileCritical } from "../validation";
import { REFS_POPULAR } from "../constants";

export interface RefFile {
  id: string;
  name: string;
  size: number;
  path?: string;
}

export interface WizardStepRefsProps {
  refsLinkInput: string;
  setRefsLinkInput: (v: string) => void;
  refsLinkError: string | null;
  setRefsLinkError: (v: string | null) => void;
  refsFiles: RefFile[];
  setRefsFiles: React.Dispatch<React.SetStateAction<RefFile[]>>;
  refsFileError: string | null;
  setRefsFileError: (v: string | null) => void;
  refsUploading: boolean;
  refsFileInputRef: React.RefObject<HTMLInputElement | null>;
  getList: (key: string) => string[];
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  toggleList: (key: string, item: string) => void;
  onUploadRefFile: (file: File) => Promise<void>;
}

export function WizardStepRefs(p: WizardStepRefsProps) {
  const refsLinks = p.getList("refs_links");
  const addLink = () => {
    const err = validateRefUrl(p.refsLinkInput);
    p.setRefsLinkError(err);
    if (err) return;
    if (refsLinks.length >= MAX_REFS_LINKS) {
      p.setRefsLinkError("Максимум " + MAX_REFS_LINKS + " ссылок");
      return;
    }
    p.setData((prev) => ({ ...prev, refs_links: [...refsLinks, p.refsLinkInput.trim()] }));
    p.setRefsLinkInput("");
  };
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    p.setRefsFileError(null);
    if (!f) return;
    const err = validateRefsFileCritical(f);
    if (err) {
      p.setRefsFileError(err);
      return;
    }
    if (p.refsFiles.length >= MAX_REF_FILES) {
      p.setRefsFileError("Максимум " + MAX_REF_FILES + " файлов");
      return;
    }
    await p.onUploadRefFile(f);
  };
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">🎧 Есть референсы? (на что должно быть похоже)</p>
      <div>
        <p className="text-xs text-gray-500 mb-1">Добавить ссылку (YouTube, Spotify и др.)</p>
        <div className="flex gap-2">
          <input
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://..."
            className="flex-1 bg-gray-900 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 text-sm"
            value={p.refsLinkInput}
            onChange={(e) => { p.setRefsLinkInput(e.target.value); p.setRefsLinkError(null); }}
            onBlur={() => p.refsLinkInput.trim() && p.setRefsLinkError(validateRefUrl(p.refsLinkInput))}
          />
          <button type="button" onClick={addLink} className="shrink-0 px-3 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:border-purple-500/50 text-sm whitespace-nowrap">Добавить</button>
        </div>
        {p.refsLinkError && <p className="mt-1 text-xs text-red-400" role="alert">{p.refsLinkError}</p>}
        {refsLinks.length > 0 && (
          <ul className="mt-2 space-y-1">
            {refsLinks.map((url, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-purple-400 truncate max-w-md">{url}</a>
                <button type="button" onClick={() => p.setData((prev) => ({ ...prev, refs_links: refsLinks.filter((_, j) => j !== i) }))} className="text-gray-500 hover:text-red-400 shrink-0" aria-label="Удалить">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Загрузить аудиофайл (референс)</p>
        <input ref={p.refsFileInputRef as React.RefObject<HTMLInputElement>} type="file" accept={REFS_ACCEPT} className="hidden" onChange={onFile} />
        <button type="button" disabled={p.refsUploading} onClick={() => p.refsFileInputRef.current?.click()} className="px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-purple-500/50 text-sm disabled:opacity-50">
          {p.refsUploading ? "Загрузка…" : "[+] Загрузить аудиофайл"}
        </button>
        {p.refsFileError && <p className="mt-1 text-xs text-red-400" role="alert">{p.refsFileError}</p>}
        <p className="mt-1 text-xs text-gray-500">WAV, MP3, FLAC, AIFF, M4A/AAC, OGG, WEBM, MIDI — см. лимиты размера</p>
        {p.refsFiles.length > 0 && (
          <ul className="mt-2 space-y-1">
            {p.refsFiles.map(({ id, name, size }) => (
              <li key={id} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="truncate">{name}</span>
                <span className="text-gray-500">{(size / 1024 / 1024).toFixed(2)} MB</span>
                <button type="button" onClick={() => p.setRefsFiles((prev) => prev.filter((x) => x.id !== id))} className="text-gray-500 hover:text-red-400 shrink-0" aria-label="Удалить">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">ИЛИ выбери из популярных:</p>
      <div className="flex flex-wrap gap-2">
        {REFS_POPULAR.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={p.getList("refs_popular").includes(opt)} onChange={() => p.toggleList("refs_popular", opt)} className="rounded border-gray-600 bg-gray-900 text-purple-500" />
            <span className="text-sm text-gray-300">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
