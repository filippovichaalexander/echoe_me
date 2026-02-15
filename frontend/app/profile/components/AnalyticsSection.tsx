"use client";

import type { AvatarProfile } from "@/lib/api/types";

export default function AnalyticsSection({ profile }: { profile: AvatarProfile }) {
  const s = profile.stats;
  const kpis = [
    { label: "Всего генераций", value: s.generation_count, icon: "🎵" },
    { label: "Модификаций", value: s.modification_count, icon: "✏️" },
    { label: "Анализов", value: s.analysis_count, icon: "📊" },
    {
      label: "Точность аватара",
      value: profile.avatar_health?.consistency_score
        ? `${Math.round(profile.avatar_health.consistency_score * 100)}%`
        : "—",
      icon: "🤖",
    },
  ];
  return (
    <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-2xl font-bold mb-6">📊 Твоя музыкальная аналитика</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-700/50"
          >
            <span className="text-gray-400 text-sm block mb-1">{label}</span>
            <p className="font-mono text-xl flex items-center gap-2">
              <span>{icon}</span>
              {value}
            </p>
          </div>
        ))}
      </div>
      <p className="text-gray-400 text-sm">
        Графики по жанрам, настроению и времени появятся после подключения
        аналитики.
      </p>
    </section>
  );
}
