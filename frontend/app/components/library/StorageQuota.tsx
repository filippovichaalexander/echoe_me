"use client";

import type { LibraryUsage, StorageLimits, UserTier } from "@/lib/api/types";

function formatSize(mb: number): string {
  if (mb < 1024) return `${Math.round(mb)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

function formatLimit(value: number | "unlimited"): string {
  if (value === "unlimited") return "∞";
  return String(value);
}

function StorageBar({
  label,
  used,
  total,
  unit = "шт",
}: {
  label: string;
  used: number;
  total: number | "unlimited";
  unit?: string;
}) {
  if (total === "unlimited") {
    return (
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300">{used} {unit}</span>
      </div>
    );
  }
  const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300">
          {used} / {formatLimit(total)} {unit}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            percent >= 90 ? "bg-red-500" : "bg-purple-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

const TIER_LABELS: Record<UserTier, string> = {
  free: "Бесплатный",
  premium: "Премиум",
  pro: "Про",
};

export default function StorageQuota({
  usage,
  limits,
  tier,
  compact = false,
}: {
  usage: LibraryUsage;
  limits: StorageLimits | null;
  tier: UserTier;
  compact?: boolean;
}) {
  if (!limits) {
    return (
      <div className="text-gray-400 text-sm">
        Тариф: {TIER_LABELS[tier]}
      </div>
    );
  }

  const totalMb = limits.total_storage_mb || 1;
  const percentUsed = (usage.total_storage_mb / totalMb) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center text-xs font-mono">
          {Math.round(percentUsed)}%
        </div>
        <span className="text-sm text-gray-400">
          {formatSize(usage.total_storage_mb)} / {formatSize(totalMb)}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700/50">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <span aria-hidden>💾</span>
        Использование хранилища
      </h4>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              percentUsed > 90 ? "bg-red-500" : "bg-purple-500"
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
        <span className="text-sm text-gray-300 tabular-nums whitespace-nowrap">
          {formatSize(usage.total_storage_mb)} / {formatSize(totalMb)}
        </span>
      </div>
      <div className="space-y-3 mb-4">
        <StorageBar
          label="Треки"
          used={usage.tracks}
          total={limits.max_tracks}
          unit="шт"
        />
        <StorageBar
          label="Проекты"
          used={usage.projects}
          total={limits.max_projects}
          unit="шт"
        />
        <StorageBar
          label="Альбомы"
          used={usage.albums}
          total={limits.max_albums}
          unit="шт"
        />
        <StorageBar
          label="Сэмплы"
          used={usage.samples}
          total={limits.max_samples}
          unit="шт"
        />
      </div>
      <div className="text-sm text-gray-400 border-t border-gray-700 pt-3 flex items-center justify-between">
        <span>
          Тариф: <span className="text-purple-400 font-medium">{TIER_LABELS[tier]}</span>
        </span>
        {percentUsed > 90 ? (
          <span className="text-amber-400">⚠ Почти заполнено</span>
        ) : (
          <span className="text-green-400/80">Есть место</span>
        )}
      </div>
    </div>
  );
}
