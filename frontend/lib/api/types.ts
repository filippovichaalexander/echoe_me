export interface AuthUser {
  id: string;
  name?: string;
  email: string;
}

export interface AvatarProfile {
  user_id: string;
  created_at: string;
  stats: {
    total_actions: number;
    generation_count: number;
    modification_count: number;
    analysis_count: number;
    last_active: string;
    streak_days: number;
  };
  preferences?: Record<string, unknown>;
  psychological_profile?: Record<string, unknown>;
  avatar_health?: {
    data_points: number;
    consistency_score?: number;
    exploration_score?: number;
  };
}

export interface ActionPayload {
  type: string;
  input_type?: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  feedback?: Record<string, unknown>;
  mood?: string;
  activity?: string;
}

export interface GenerateResult {
  audio_url: string | null;
  vector?: number[];
  explanation?: Record<string, unknown>;
}

/** Тариф пользователя (библиотека и лимиты). */
export type UserTier = "free" | "premium" | "pro";

/** Трек в библиотеке. */
export interface LibraryTrack {
  id: string;
  user_id: string;
  url: string;
  name: string;
  prompt: string;
  created_at: string;
  size_bytes?: number;
}

/** Проект в библиотеке (create/wizard). */
export interface LibraryProject {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  files?: { id: string; name: string; type: string }[];
}

/** Использование хранилища (для квоты). */
export interface LibraryUsage {
  total_storage_mb: number;
  tracks: number;
  albums: number;
  projects: number;
  samples: number;
}

/** Лимиты по тарифу. */
export interface StorageLimits {
  total_storage_mb: number;
  max_file_size_mb: number;
  max_tracks: number;
  max_projects: number | "unlimited";
  max_albums: number | "unlimited";
  max_samples: number | "unlimited";
  version_history_days?: number;
  can_export?: boolean;
  export_formats?: string[];
}

/** Ответ API подписки. */
export interface SubscriptionResponse {
  tier: UserTier;
  usage: LibraryUsage;
  limits: StorageLimits;
  within_limits: boolean;
  warnings: string[];
}
