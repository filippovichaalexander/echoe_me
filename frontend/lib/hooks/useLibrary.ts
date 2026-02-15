"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../api/client";
import type { LibraryTrack } from "../api/types";

export function useLibrary() {
  const [tracks, setTracks] = useState<LibraryTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    try {
      setError(null);
      const list = await apiClient.get<LibraryTrack[]>("/api/library/tracks");
      setTracks(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки библиотеки");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const addTrack = useCallback(
    async (params: { url: string; name?: string; prompt?: string }) => {
      const track = await apiClient.post<LibraryTrack>("/api/library/tracks", params);
      setTracks((prev) => [...prev, track]);
      return track;
    },
    []
  );

  const removeTrack = useCallback(async (trackId: string) => {
    await apiClient.delete(`/api/library/tracks/${trackId}`);
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  return {
    tracks,
    loading,
    error,
    refresh: fetchTracks,
    addTrack,
    removeTrack,
  };
}
