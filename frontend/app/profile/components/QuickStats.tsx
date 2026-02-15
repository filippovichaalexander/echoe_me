"use client";

import type { AvatarProfile } from "@/lib/api/types";

function formatLastActive(lastActive: string): string {
  try {
    const d = new Date(lastActive);
    if (isNaN(d.getTime())) return lastActive;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return d.toLocaleDateString("ru-RU");
  } catch {
    return lastActive;
  }
}

export default function QuickStats({ profile }: { profile: AvatarProfile }) {
  const s = profile.stats;
  const items = [
    { label: "Дней активности", value: s.streak_days, icon: "📅" },
    { label: "Всего генераций", value: s.generation_count, icon: "🎵" },
    { label: "Всего действий", value: s.total_actions, icon: "✨" },
    { label: "Последняя активность", value: formatLastActive(s.last_active), icon: "⏰" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ label, value, icon }) => (
        <div
          key={label}
          className="bg-gray-700/50 rounded-xl p-4 border border-gray-700/50"
        >
          <span className="text-gray-400 text-sm block mb-1">{label}</span>
          <p className="font-mono text-lg flex items-center gap-2">
            <span>{icon}</span>
            {typeof value === "number" ? value : value}
          </p>
        </div>
      ))}
    </div>
  );
}
