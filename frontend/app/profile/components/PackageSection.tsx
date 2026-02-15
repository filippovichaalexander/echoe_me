"use client";

import { useSubscription } from "@/lib/hooks/useSubscription";
import StorageQuota from "@/app/components/library/StorageQuota";
import TariffInfo from "@/app/components/library/TariffInfo";
import Link from "next/link";

const TIER_NAMES: Record<string, string> = {
  free: "Бесплатный",
  premium: "Премиум",
  pro: "Про",
};

export default function PackageSection() {
  const { tier, usage, limits, withinLimits, warnings, loading } = useSubscription();

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 text-center text-gray-400">
        Загрузка…
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-2xl font-bold mb-6">📦 Твой пакет</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-700/50">
          <div>
            <p className="text-gray-400 text-sm mb-1">Текущий тариф</p>
            <p className="text-xl font-bold text-purple-400">
              {TIER_NAMES[tier] ?? tier}
            </p>
          </div>
          {!withinLimits && warnings.length > 0 && (
            <p className="text-amber-400 text-sm">
              ⚠ {warnings[0]}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold mb-4">Использование</h3>
        <StorageQuota
          usage={usage}
          limits={limits}
          tier={tier}
          compact={false}
        />
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold mb-4">Доступные тарифы</h3>
        <TariffInfo currentTier={tier} />
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-4">
            Больше треков и места — в тарифах Премиум и Про.
          </p>
          <Link
            href="/library"
            className="inline-block rounded-xl px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-500 transition"
          >
            Открыть библиотеку →
          </Link>
        </div>
      </div>
    </section>
  );
}
