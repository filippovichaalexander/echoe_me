"use client";

import type { AvatarProfile } from "@/lib/api/types";
import AvatarVisualizer from "@/app/components/AvatarVisualizer";
import QuickStats from "./QuickStats";

export default function AvatarDashboardSection({
  profile,
}: {
  profile: AvatarProfile;
}) {
  const understanding =
    profile.avatar_health?.consistency_score != null
      ? Math.round(profile.avatar_health.consistency_score * 100)
      : Math.min(100, (profile.stats.total_actions || 0) * 5);

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 rounded-2xl p-6 sm:p-8 border border-purple-800/50">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Твой музыкальный аватар
            </h2>
            <p className="text-purple-200 text-sm">
              Аватар учится на твоих действиях
            </p>
          </div>
          <div className="bg-white/10 rounded-full px-4 py-2 w-fit">
            <span className="text-white text-sm font-medium">
              Понимание: {Math.min(100, understanding)}%
            </span>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <AvatarVisualizer profile={profile} />
        </div>
        <div className="mt-6 bg-white/10 rounded-xl p-4 backdrop-blur border border-white/10">
          <p className="text-white/90 text-sm">
            💭 Чем больше ты создаёшь музыку и отмечаешь, что нравится — тем
            точнее аватар понимает твой вкус и контекст.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Быстрая статистика</h3>
        <QuickStats profile={profile} />
      </section>
    </div>
  );
}
