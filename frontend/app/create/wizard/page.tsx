"use client";

import { useState } from "react";
import Link from "next/link";
import AvatarChatSidebar from "@/app/components/AvatarChatSidebar";

const TYPE_OPTIONS = ["Полная композиция", "Стем", "Модификация"] as const;

const STEPS = [
  { id: "mood", title: "Настроение?", type: "text" as const },
  { id: "details", title: "Детали", type: "sliders" as const },
];

export default function WizardPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});

  const showChat = selectedType !== null;
  const wizardSteps = STEPS;
  const current = wizardSteps[step];
  const isLast = step === wizardSteps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Пошаговый конструктор</h1>
          <Link
            href="/create"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Назад
          </Link>
        </div>
      </header>

      {!showChat ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-lg font-medium mb-4">Что создаём?</h2>
              <div className="space-y-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedType(opt)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          <main className="flex-1 min-w-0 overflow-auto">
            <div className="container mx-auto px-4 py-8 max-w-xl">
              <p className="text-gray-400 text-sm mb-4">
                Выбрано: <span className="text-white font-medium">{selectedType}</span>
              </p>
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-lg font-medium mb-4">{current.title}</h2>
                {current.type === "text" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Опиши настроение"
                      className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                      value={(data[current.id] as string) ?? ""}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, [current.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setStep(step + 1);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="mt-4 bg-purple-600 hover:bg-purple-500 rounded-xl px-4 py-2 font-medium transition"
                    >
                      Далее
                    </button>
                  </div>
                )}
                {current.type === "sliders" && (
                  <div>
                    <p className="text-gray-400 mb-4">
                      Энергия, сложность — позже слайдеры.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="bg-purple-600 hover:bg-purple-500 rounded-xl px-4 py-2 font-medium transition"
                    >
                      {isLast ? "Создать" : "Далее"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
          <div className="w-full md:w-[22rem] shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-gray-800 h-80 md:h-full md:min-h-0">
            <AvatarChatSidebar creationType={selectedType} />
          </div>
        </div>
      )}
    </div>
  );
}
