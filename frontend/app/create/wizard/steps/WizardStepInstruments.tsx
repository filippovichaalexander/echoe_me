"use client";

import { INSTRUMENTS_MAIN, INSTRUMENTS_EXTRA } from "../constants";

export interface WizardStepInstrumentsProps {
  getList: (key: string) => string[];
  toggleList: (key: string, item: string) => void;
}

export function WizardStepInstruments({ getList, toggleList }: WizardStepInstrumentsProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">🎸 Какие инструменты?</p>
      <div>
        <p className="text-xs text-gray-500 mb-2">Основные:</p>
        <div className="flex flex-wrap gap-2">
          {INSTRUMENTS_MAIN.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={getList("instruments_main").includes(opt)} onChange={() => toggleList("instruments_main", opt)} className="rounded border-gray-600 bg-gray-900 text-purple-500" />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Дополнительно:</p>
        <div className="flex flex-wrap gap-2">
          {INSTRUMENTS_EXTRA.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={getList("instruments_extra").includes(opt)} onChange={() => toggleList("instruments_extra", opt)} className="rounded border-gray-600 bg-gray-900 text-purple-500" />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
