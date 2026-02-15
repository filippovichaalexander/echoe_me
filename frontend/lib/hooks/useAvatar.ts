"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../api/client";
import type { AvatarProfile, ActionPayload, GenerateResult } from "../api/types";

interface UseAvatarReturn {
  profile: AvatarProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  addAction: (action: ActionPayload) => Promise<void>;
  generateMusic: (context?: Record<string, unknown>) => Promise<GenerateResult | undefined>;
  getExplanation: (decision: Record<string, unknown>, context?: Record<string, unknown>) => Promise<unknown>;
  getRecommendations: (context?: Record<string, unknown>) => Promise<unknown>;
}

export function useAvatar(): UseAvatarReturn {
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiClient.get<AvatarProfile>("/api/avatar/profile");
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const addAction = useCallback(async (action: ActionPayload) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/api/avatar/action", action);
      await fetchProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const generateMusic = useCallback(async (context?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.post<GenerateResult>("/api/avatar/generate", { context });
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExplanation = useCallback(
    async (decision: Record<string, unknown>, context?: Record<string, unknown>) => {
      return apiClient.post("/api/avatar/explain", { decision, context });
    },
    []
  );

  const getRecommendations = useCallback(async () => {
    return apiClient.get("/api/avatar/profile");
  }, []);

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    addAction,
    generateMusic,
    getExplanation,
    getRecommendations,
  };
}
