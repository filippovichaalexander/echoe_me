"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  { id: "type", title: "Что создаём?", type: "options" as const, options: ["Полная композиция", "Стем", "Модификация"] },
  { id: "mood", title: "Настроение?", type: "text" as const },
  { id: "details", title: "Детали", type: "sliders" as const },
];

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Пошаговый конструктор</h1>
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-lg font-medium mb-4">{current.title}</h2>
        {current.type === "options" && (
          <div className="space-y-2">
            {current.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setData({ ...data, [current.id]: opt });
                  setStep(step + 1);
                }}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {current.type === "text" && (
          <div>
            <input
              type="text"
              placeholder="Опиши настроение"
              className="w-full bg-gray-700 rounded-lg px-4 py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setData({ ...data, [current.id]: (e.target as HTMLInputElement).value });
                  setStep(step + 1);
                }
              }}
            />
            <button
              onClick={() => setStep(step + 1)}
              className="mt-4 bg-purple-600 rounded-lg px-4 py-2"
            >
              Далее
            </button>
          </div>
        )}
        {current.type === "sliders" && (
          <div>
            <p className="text-gray-400 mb-4">Энергия, сложность — позже слайдеры.</p>
            <button
              onClick={() => setStep(step + 1)}
              className="bg-purple-600 rounded-lg px-4 py-2"
            >
              {isLast ? "Создать" : "Далее"}
            </button>
          </div>
        )}
      </div>
      <Link href="/create" className="inline-block mt-6 text-purple-400 hover:underline">
        ← Назад
      </Link>
    </div>
  );
}
