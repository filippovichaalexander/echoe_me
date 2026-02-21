"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../api/client";
import type { LibraryProject } from "../api/types";

export function useLibraryProjects() {
  const [projects, setProjects] = useState<LibraryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const list = await apiClient.get<LibraryProject[]>("/api/library/projects");
      setProjects(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки проектов");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async (name: string) => {
    const project = await apiClient.post<LibraryProject>("/api/library/projects", {
      name: name.trim(),
    });
    setProjects((prev) => [...prev, project]);
    return project;
  }, []);

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects,
    createProject,
  };
}
