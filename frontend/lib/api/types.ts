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
