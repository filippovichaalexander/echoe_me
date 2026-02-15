"use client";

import Link from "next/link";
import type { AvatarProfile } from "@/lib/api/types";
import { getAvatarLevelProgress } from "@/lib/avatarProgress";

const STAT_LABELS: { key: keyof AvatarProfile["stats"]; label: string; icon: string }[] = [
  { key: "generation_count", label: "Генераций", icon: "🎵" },
  { key: "modification_count", label: "Модификаций", icon: "✏️" },
  { key: "analysis_count", label: "Анализов", icon: "📊" },
];

export default function AvatarVisualizer({ profile }: { profile: AvatarProfile }) {
  const stats = profile.stats;
  const health = profile.avatar_health;
  const totalActions = stats.total_actions ?? 0;
  const { level, progressPercent, actionsToNextLevel } = getAvatarLevelProgress(totalActions);

  return (
    <div className="space-y-5">
      {/* Прогресс уровня — связка с личным кабинетом */}
      <div className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 rounded-xl p-4 border border-amber-500/30">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-amber-200/90 text-sm font-medium flex items-center gap-1.5">
            <span aria-hidden>🌟</span>
            Уровень {level}
          </span>
          <span className="text-amber-200/70 text-xs">
            до след. уровня: {actionsToNextLevel} действий
          </span>
        </div>
        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Всего действий — одно число, чтобы не путать с типами */}
      <div className="bg-gray-700/50 rounded-xl p-3 border border-gray-600/50 hover:border-gray-500 transition">
        <span className="text-gray-400 text-xs block mb-0.5">
          Всего действий
        </span>
        <p className="font-mono text-2xl flex items-center gap-2">
          <span aria-hidden>✨</span>
          {totalActions}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          генерации + изменения + анализы
        </p>
      </div>

      {/* Разбивка по типам с иконками */}
      <div className="grid grid-cols-1 gap-2">
        {STAT_LABELS.map(({ key, label, icon }) => (
          <div
            key={key}
            className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2.5 border border-gray-700/50 hover:border-purple-500/30 hover:bg-gray-700/70 transition"
          >
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span aria-hidden className="text-base">{icon}</span>
              {label}
            </span>
            <span className="font-mono text-lg tabular-nums">
              {stats[key] ?? 0}
            </span>
          </div>
        ))}
      </div>

      {health?.data_points !== undefined && (
        <p className="text-gray-400 text-xs flex items-center gap-1.5">
          <span aria-hidden>📈</span>
          Точек данных: {health.data_points}
        </p>
      )}

      {Object.keys(profile.preferences || {}).length > 0 && (
        <div className="text-sm text-gray-300 pt-1 border-t border-gray-700/50">
          <span className="text-gray-400">Предпочтения: </span>
          {JSON.stringify(profile.preferences)}
        </div>
      )}

      <Link
        href="/profile"
        className="block text-center text-sm text-purple-400 hover:text-purple-300 transition py-2 rounded-lg hover:bg-purple-500/10"
      >
        Подробнее в личном кабинете →
      </Link>
    </div>
  );
}
