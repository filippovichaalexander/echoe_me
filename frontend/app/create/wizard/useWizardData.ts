"use client";

import { useState, useCallback } from "react";

export function useWizardData() {
  const [data, setData] = useState<Record<string, unknown>>({});

  const getSet = useCallback((key: string, subKey?: string) => {
    const val = (data[key] ?? (subKey ? {} : "")) as Record<string, unknown> | string;
    if (subKey !== undefined && typeof val === "object") return (val[subKey] ?? "") as string;
    return (val ?? "") as string;
  }, [data]);

  const getList = useCallback((key: string): string[] => {
    return Array.isArray(data[key]) ? (data[key] as string[]) : [];
  }, [data]);

  const toggleList = useCallback((key: string, item: string) => {
    const arr = Array.isArray(data[key]) ? (data[key] as string[]) : [];
    const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
    setData((p) => ({ ...p, [key]: next }));
  }, [data]);

  const setValue = useCallback((key: string, value: unknown, subKey?: string) => {
    if (subKey !== undefined) {
      setData((p) => ({ ...p, [key]: { ...((p[key] as object) ?? {}), [subKey]: value } }));
    } else {
      setData((p) => ({ ...p, [key]: value }));
    }
  }, []);

  return { data, setData, getSet, getList, toggleList, setValue };
}
