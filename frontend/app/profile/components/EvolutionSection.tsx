"use client";

import type { AvatarProfile } from "@/lib/api/types";
import { getAvatarLevelProgress } from "@/lib/avatarProgress";

export default function EvolutionSection({ profile }: { profile: AvatarProfile }) {
  const s = profile.stats;
  const totalActions = s.total_actions ?? 0;
  const { level, progressPercent, actionsToNextLevel } = getAvatarLevelProgress(totalActions);
  const health = profile.avatar_health;
  const genreProgress = health?.data_points
    ? Math.min(100, health.data_points * 10)
    : 0;
  const moodProgress = Math.min(100, (s.generation_count || 0) * 8);

  return (
    <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-2xl font-bold mb-6">🌱 Эволюция аватара</h3>
      <div className="bg-gradient-to-r from-amber-600/40 to-orange-600/40 rounded-xl p-6 mb-6 border border-amber-500/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-amber-200/90 text-sm mb-1">Уровень {level}</div>
            <div className="text-2xl font-bold mb-1">Растём вместе</div>
            <div className="text-amber-200/80 text-sm">
              Дней подряд: {s.streak_days} · До след. уровня: {actionsToNextLevel} действий
            </div>
          </div>
          <span className="text-5xl">🌟</span>
        </div>
        <div className="mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <h4 className="font-bold mb-4">Прогресс понимания</h4>
      <div className="space-y-3">
        {[
          { label: "Понимание жанров", value: genreProgress, icon: "🎵" },
          { label: "Эмоциональный контекст", value: moodProgress, icon: "😊" },
          {
            label: "Консистентность",
            value: health?.consistency_score
              ? Math.round(health.consistency_score * 100)
              : 0,
            icon: "⏰",
          },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex items-center gap-3">
            <span>{icon}</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{label}</span>
                <span className="text-gray-400">{value}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
