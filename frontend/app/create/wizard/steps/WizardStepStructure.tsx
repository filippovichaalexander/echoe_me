"use client";

import { STRUCTURE_TEMPLATES, PARTS_OPTIONS } from "../constants";

export interface WizardStepStructureProps {
  getSet: (key: string, subKey?: string) => string;
  getList: (key: string) => string[];
  setValue: (key: string, value: unknown, subKey?: string) => void;
  toggleList: (key: string, item: string) => void;
}

export function WizardStepStructure({ getSet, getList, setValue, toggleList }: WizardStepStructureProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">📐 Структура композиции (для полной композиции)</p>
      <div>
        <p className="text-xs text-gray-500 mb-2">Базовый шаблон:</p>
        <select value={getSet("structure", "template")} onChange={(e) => setValue("structure", e.target.value, "template")} className="bg-gray-900 rounded-lg px-3 py-2 text-white border border-gray-700 text-sm w-full max-w-md">
          <option value="">Выбрать структуру</option>
          {STRUCTURE_TEMPLATES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {STRUCTURE_TEMPLATES.map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={getList("structure_type").includes(opt)}
              onChange={() => toggleList("structure_type", opt)}
              className="h-5 w-5 rounded border-2 border-gray-600 bg-gray-900 text-purple-500 cursor-pointer p-0.5"
            />
            <span className="text-sm text-gray-300">{opt.split(":")[0]}</span>
          </label>
        ))}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Сколько частей:</p>
        <div className="flex flex-wrap gap-2">
          {PARTS_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="parts"
                checked={getSet("structure", "parts") === opt}
                onChange={() => setValue("structure", opt, "parts")}
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
