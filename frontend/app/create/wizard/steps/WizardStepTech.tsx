"use client";

import { DURATION_OPTIONS, BPM_OPTIONS, COMPLEXITY_OPTIONS, TONALITY_OPTIONS } from "../constants";

export interface WizardStepTechProps {
  getSet: (key: string, subKey?: string) => string;
  setValue: (key: string, value: unknown, subKey?: string) => void;
}

export function WizardStepTech({ getSet, setValue }: WizardStepTechProps) {
  return (
    <div className="space-y-5">
      <p className="text-gray-300 text-sm">⚙️ Технические детали</p>
      <div>
        <p className="text-xs text-gray-500 mb-2">Длительность:</p>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="duration" checked={getSet("tech", "duration") === opt} onChange={() => setValue("tech", opt, "duration")} className="text-purple-500" />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Темп (BPM):</p>
        <div className="flex flex-wrap gap-2">
          {BPM_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="bpm" checked={getSet("tech", "bpm") === opt} onChange={() => setValue("tech", opt, "bpm")} className="text-purple-500" />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Тональность (опционально):</p>
        <select value={getSet("tech", "key")} onChange={(e) => setValue("tech", e.target.value, "key")} className="bg-gray-900 rounded-lg px-3 py-2 text-white border border-gray-700 text-sm">
          {TONALITY_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Сложность:</p>
        <div className="flex flex-wrap gap-2">
          {COMPLEXITY_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="complexity" checked={getSet("tech", "complexity") === opt} onChange={() => setValue("tech", opt, "complexity")} className="text-purple-500" />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
