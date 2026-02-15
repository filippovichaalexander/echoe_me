const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

const defaultInit: RequestInit = {
  credentials: "include",
};

export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      ...defaultInit,
      ...options,
      headers: { ...defaultHeaders, ...options?.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  /** POST: body обязателен для регистрации/логина; options — по желанию (signal, доп. headers). */
  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    debugger
    const res = await fetch(`${API_URL}${path}`, {
      ...defaultInit,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
      headers: { ...defaultHeaders, ...options?.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
