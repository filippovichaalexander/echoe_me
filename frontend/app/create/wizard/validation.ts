/** Валидация полей и файлов конструктора */

const ALLOWED_URL_SCHEMES = ["https:", "http:"];
const MAX_URL_LENGTH = 2048;

export const MAX_REFS_LINKS = 10;

/** Безопасная валидация веб-ссылки */
export function validateRefUrl(input: string): string | null {
  const raw = (input || "").trim();
  if (!raw) return "Введите ссылку";
  if (raw.length > MAX_URL_LENGTH) return "Ссылка слишком длинная";
  try {
    const url = new URL(raw);
    if (!ALLOWED_URL_SCHEMES.includes(url.protocol)) return "Допустимы только ссылки HTTP/HTTPS";
    if (url.protocol === "javascript:" || url.href.toLowerCase().startsWith("javascript:")) return "Недопустимый протокол";
    if (url.username || url.password) return "Ссылка не должна содержать логин/пароль";
    const host = url.hostname.replace(/^\.+|\.+$/g, "");
    if (!host || host.length > 253) return "Некорректный адрес";
    if (/[<>"']/.test(raw)) return "Недопустимые символы в ссылке";
    return null;
  } catch {
    return "Введите корректную веб-ссылку (например https://...)";
  }
}

/** Спеки загрузки референсов (расширение → макс. размер в байтах) */
export const REFS_UPLOAD_SPEC: Record<string, number> = {
  ".wav": 200 * 1024 * 1024,
  ".mp3": 50 * 1024 * 1024,
  ".flac": 100 * 1024 * 1024,
  ".aiff": 200 * 1024 * 1024,
  ".m4a": 50 * 1024 * 1024,
  ".aac": 50 * 1024 * 1024,
  ".ogg": 50 * 1024 * 1024,
  ".webm": 50 * 1024 * 1024,
  ".mid": 10 * 1024 * 1024,
  ".midi": 10 * 1024 * 1024,
};
export const REFS_ACCEPT = ".wav,.mp3,.flac,.aiff,.aac,.m4a,.ogg,.webm,.mid,.midi";
export const MAX_REF_FILES = 5;

function getRefsUploadMaxSize(ext: string): number {
  return REFS_UPLOAD_SPEC[ext.toLowerCase()] ?? 0;
}

/** Критическая валидация аудио-референса на фронте */
export function validateRefsFileCritical(file: File): string | null {
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  const max = getRefsUploadMaxSize(ext);
  if (!max) return `Формат не поддерживается. Допустимы: ${REFS_ACCEPT}`;
  if (file.size > max) {
    const mb = Math.round(max / (1024 * 1024));
    return `Макс. размер для ${ext}: ${mb} MB`;
  }
  if (file.size === 0) return "Файл пустой";
  if (/[\x00-\x1f\x7f]|\.\.|[\/\\]/.test(file.name)) return "Недопустимое имя файла";
  return null;
}

/** Текстовые файлы (шаг 8) */
export const EXTRA_TEXT_SPEC: Record<string, number> = {
  ".txt": 5 * 1024 * 1024,
  ".md": 5 * 1024 * 1024,
  ".rtf": 10 * 1024 * 1024,
  ".pdf": 20 * 1024 * 1024,
};
export const EXTRA_TEXT_ACCEPT = ".txt,.md,.rtf,.pdf";
const EXTRA_TEXT_EXTENSIONS = new Set([".txt", ".md", ".rtf", ".pdf"]);
export const MAX_EXTRA_TEXT_FILES = 3;
const MAX_FILENAME_LENGTH = 255;
const ALLOWED_TEXT_MIMES = new Set([
  "text/plain",
  "text/markdown",
  "text/x-markdown",
  "application/rtf",
  "application/pdf",
]);

export function isSafeTextFilename(name: string): { ok: boolean; error?: string } {
  if (!name || name.length > MAX_FILENAME_LENGTH) return { ok: false, error: "Недопустимое имя файла" };
  if (/[\x00-\x1f\x7f]/.test(name)) return { ok: false, error: "В имени файла запрещены управляющие символы" };
  if (/\.\.|[\/\\]/.test(name)) return { ok: false, error: "В имени не допускаются путь или .." };
  const parts = name.split(".");
  if (parts.length < 2) return { ok: false, error: "Файл должен иметь расширение" };
  const ext = "." + (parts.pop() || "").toLowerCase();
  if (parts.some((p) => /\.(txt|md|rtf|pdf|exe|bat|cmd|sh|js|vbs|wsf|scr|pif)$/i.test(p))) return { ok: false, error: "Недопустимое имя (подозрительное расширение)" };
  if (!EXTRA_TEXT_EXTENSIONS.has(ext)) return { ok: false, error: `Допустимы только: ${EXTRA_TEXT_ACCEPT}` };
  return { ok: true };
}

export function validateExtraTextFileCritical(file: File): string | null {
  const nameCheck = isSafeTextFilename(file.name);
  if (!nameCheck.ok) return nameCheck.error ?? "Недопустимый файл";
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  const max = EXTRA_TEXT_SPEC[ext];
  if (!max) return `Формат не поддерживается. Допустимы: ${EXTRA_TEXT_ACCEPT}`;
  if (file.size > max) {
    const mb = Math.round(max / (1024 * 1024));
    return `Макс. размер для ${ext}: ${mb} MB`;
  }
  if (file.size === 0) return "Файл пустой";
  if (file.type && !ALLOWED_TEXT_MIMES.has(file.type)) return "Тип файла не разрешён (допустимы текст, markdown, RTF, PDF)";
  return null;
}

/** Валидация имени проекта */
export function validateProjectName(name: string): string | null {
  const t = name.trim();
  if (!t) return "Введите имя проекта";
  if (/\s/.test(name)) return "Пробелы не допускаются";
  if (t.length > 64) return "Не более 64 символов";
  if (!/^[\w\-]+$/.test(t)) return "Только буквы, цифры, дефис и подчёркивание";
  if (!/[a-zA-Zа-яА-ЯёЁ]/.test(t)) return "Нужна хотя бы одна буква";
  return null;
}
