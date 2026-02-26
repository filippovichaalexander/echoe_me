"use client";

import { CONTEXT_WHERE, CONTEXT_AUDIENCE } from "../constants";

export interface WizardStepContextProps {
  getList: (key: string) => string[];
  getSet: (key: string, subKey?: string) => string;
  toggleList: (key: string, item: string) => void;
  setValue: (key: string, value: unknown, subKey?: string) => void;
}

export function WizardStepContext({ getList, getSet, toggleList, setValue }: WizardStepContextProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">📍 Где будет использоваться?</p>
      <div className="flex flex-wrap gap-2">
        {CONTEXT_WHERE.map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={getList("context_where").includes(opt)}
              onChange={() => toggleList("context_where", opt)}
              className="h-5 w-5 rounded border-2 border-gray-600 bg-gray-900 text-purple-500 cursor-pointer p-0.5"
            />
            <span className="text-sm text-gray-300">{opt}</span>
          </label>
        ))}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Для какой аудитории?</p>
        <div className="flex flex-wrap gap-2">
          {CONTEXT_AUDIENCE.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="audience" checked={getSet("context", "audience") === opt} onChange={() => setValue("context", opt, "audience")} className="text-purple-500" />
              <span className="text-sm text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
