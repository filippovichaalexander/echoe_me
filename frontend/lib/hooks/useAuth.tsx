"use client";

import { useState, useCallback, useEffect, useRef, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiClient } from "../api/client";
import type { AuthUser } from "../api/types";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const meFetchingRef = useRef(false);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiClient.get<{ user: AuthUser }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      meFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
    if (!path) {
      setUser(null);
      setLoading(false);
      return;
    }
    const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));
    if (isPublic) {
      setUser(null);
      setLoading(false);
      return;
    }
    if (meFetchingRef.current) return;
    meFetchingRef.current = true;
    refreshUser();
  }, [pathname, refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiClient.post<{ user: AuthUser }>("/api/auth/login", { email, password });
      setUser(data.user);
      router.replace("/");
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirm: string) => {
      const data = await apiClient.post<{ user: AuthUser }>("/api/auth/register", {
        name,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      setUser(data.user);
      router.replace("/");
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
