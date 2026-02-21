const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

const defaultInit: RequestInit = {
  credentials: "include",
};

export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${API_URL}${path}`, {
        ...defaultInit,
        ...options,
        headers: { ...defaultHeaders, ...options?.headers },
      });
    } catch (err) {
      const msg = err instanceof TypeError && err.message === "Failed to fetch"
        ? `Не удалось подключиться к API (${API_URL}). Проверьте, что бэкенд запущен.`
        : (err instanceof Error ? err.message : "Ошибка сети");
      throw new Error(msg);
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  /** POST: body обязателен для регистрации/логина; options — по желанию (signal, доп. headers). */
  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${API_URL}${path}`, {
        ...defaultInit,
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...options,
        headers: { ...defaultHeaders, ...options?.headers },
      });
    } catch (err) {
      const msg = err instanceof TypeError && err.message === "Failed to fetch"
        ? `Не удалось подключиться к API (${API_URL}). Проверьте, что бэкенд запущен на порту 8000.`
        : (err instanceof Error ? err.message : "Ошибка сети");
      throw new Error(msg);
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      ...defaultInit,
      method: "DELETE",
      ...options,
      headers: { ...defaultHeaders, ...options?.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    const text = await res.text();
    return (text ? JSON.parse(text) : {}) as T;
  },

  /**
   * Загрузка файла (multipart/form-data). Не устанавливаем Content-Type — браузер задаёт boundary.
   * Используется для ref-audio и ref-text; валидация и безопасность — на бэкенде.
   */
  async uploadFile<T = { id: string; name: string; size: number; path: string }>(
    path: string,
    file: File,
    options?: { signal?: AbortSignal }
  ): Promise<T> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}${path}`, {
      ...defaultInit,
      method: "POST",
      body: form,
      signal: options?.signal,
      headers: {} as Record<string, string>,
    });
    if (!res.ok) {
      const text = await res.text();
      let msg = text;
      try {
        const j = JSON.parse(text);
        if (j.detail) msg = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
      } catch {
        // leave msg as text
      }
      throw new Error(msg);
    }
    return res.json();
  },

  /**
   * Отправка голосового описания (шаг 2 визарда): аудио + project_id, creation_type, transcription.
   * Учитывается в истории создания сущности, окружении проекта и цифровом аватаре.
   */
  async uploadVoiceDescription(
    path: string,
    file: Blob,
    params: { projectId: string; creationType: string; transcription?: string },
    options?: { signal?: AbortSignal }
  ): Promise<{ status: string; audio_id: string; path: string; transcription?: string | null }> {
    const form = new FormData();
    const ext = file.type.indexOf("ogg") >= 0 ? ".ogg" : ".webm";
    form.append("file", file, `recording${ext}`);
    form.append("project_id", params.projectId);
    form.append("creation_type", params.creationType);
    if (params.transcription != null && params.transcription !== "") form.append("transcription", params.transcription);
    const res = await fetch(`${API_URL}${path}`, {
      ...defaultInit,
      method: "POST",
      body: form,
      signal: options?.signal,
      headers: {} as Record<string, string>,
    });
    if (!res.ok) {
      const text = await res.text();
      let msg = text;
      try {
        const j = JSON.parse(text);
        if (j.detail) msg = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
      } catch {
        //
      }
      throw new Error(msg);
    }
    return res.json();
  },
};
