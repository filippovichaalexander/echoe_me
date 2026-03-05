"use client";

import { DURATION_OPTIONS, BPM_OPTIONS, COMPLEXITY_OPTIONS } from "../constants";
import { KeySelector } from "../components/KeySelector";
import { useSubscription } from "@/lib/hooks/useSubscription";

export interface WizardStepTechProps {
  getSet: (key: string, subKey?: string) => string;
  setValue: (key: string, value: unknown, subKey?: string) => void;
}

export function WizardStepTech({ getSet, setValue }: WizardStepTechProps) {
  const { tier } = useSubscription();

  return (
    <div className="space-y-5">
      <p className="text-gray-300 text-sm">⚙️ Технические детали</p>
      <div>
        <p className="text-xs text-gray-500 mb-2">Длительность:</p>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="duration"
                checked={getSet("tech", "duration") === opt}
                onChange={() => setValue("tech", opt, "duration")}
                className="h-5 w-5 rounded-full border-2 border-gray-600 bg-gray-900 text-purple-500 cursor-pointer p-0.5"
              />
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
              <input
                type="radio"
                name="bpm"
                checked={getSet("tech", "bpm") === opt}
                onChange={() => setValue("tech", opt, "bpm")}
                className="h-5 w-5 rounded-full border-2 border-gray-600 bg-gray-900 text-purple-500 cursor-pointer p-0.5"
              />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Тональность (опционально):</p>
        <KeySelector
          tier={tier}
          value={getSet("tech", "key")}
          onChange={(val) => setValue("tech", val, "key")}
        />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Сложность:</p>
        <div className="flex flex-wrap gap-2">
          {COMPLEXITY_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="complexity"
                checked={getSet("tech", "complexity") === opt}
                onChange={() => setValue("tech", opt, "complexity")}
                className="h-5 w-5 rounded-full border-2 border-gray-600 bg-gray-900 text-purple-500 cursor-pointer p-0.5"
              />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

