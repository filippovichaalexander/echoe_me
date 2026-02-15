"use client";

import type { UserTier } from "@/lib/api/types";

const TARIFFS: { id: UserTier; name: string; tracks: number | string; storage: string }[] = [
  { id: "free", name: "Бесплатный", tracks: 10, storage: "100 MB" },
  { id: "premium", name: "Премиум", tracks: 100, storage: "1 GB" },
  { id: "pro", name: "Про", tracks: "∞", storage: "10 GB" },
];

export default function TariffInfo({ currentTier }: { currentTier: UserTier }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      <h4 className="font-semibold mb-3 text-sm text-gray-300">Тарифы</h4>
      <ul className="space-y-2 text-sm">
        {TARIFFS.map((t) => (
          <li
            key={t.id}
            className={`flex justify-between items-center ${
              t.id === currentTier ? "text-purple-400 font-medium" : "text-gray-400"
            }`}
          >
            <span>{t.name}</span>
            <span className="tabular-nums">
              {t.tracks} треков · {t.storage}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
