"use client";

interface Profile {
  user_id?: string;
  stats?: Record<string, number>;
  preferences?: Record<string, unknown>;
  avatar_health?: { data_points?: number; consistency_score?: number };
}

export default function AvatarVisualizer({ profile }: { profile: Profile }) {
  const stats = profile.stats || {};
  const health = profile.avatar_health || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <span className="text-gray-400">Действий</span>
          <p className="font-mono text-lg">{stats.total_actions ?? 0}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <span className="text-gray-400">Генераций</span>
          <p className="font-mono text-lg">{stats.generation_count ?? 0}</p>
        </div>
      </div>
      {health.data_points !== undefined && (
        <p className="text-gray-400 text-sm">
          Точек данных: {health.data_points}
        </p>
      )}
      {Object.keys(profile.preferences || {}).length > 0 && (
        <div className="text-sm text-gray-300">
          <span className="text-gray-400">Предпочтения: </span>
          {JSON.stringify(profile.preferences)}
        </div>
      )}
    </div>
  );
}
