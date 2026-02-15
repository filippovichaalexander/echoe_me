"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../api/client";
import type { SubscriptionResponse } from "../api/types";

export function useSubscription() {
  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setError(null);
      const res = await apiClient.get<SubscriptionResponse>("/api/subscription/");
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки тарифа");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    tier: data?.tier ?? "free",
    usage: data?.usage ?? {
      total_storage_mb: 0,
      tracks: 0,
      albums: 0,
      projects: 0,
      samples: 0,
    },
    limits: data?.limits ?? null,
    withinLimits: data?.within_limits ?? true,
    warnings: data?.warnings ?? [],
    loading,
    error,
    refresh: fetchSubscription,
  };
}
