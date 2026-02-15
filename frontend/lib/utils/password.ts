/**
 * Оценка силы пароля (0–4).
 * 0–1 = Слабый, 1–2 = Средний, 2–4 = Надёжный.
 */
export function checkPasswordStrength(password: string): number {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;

  return Math.min(4, Math.floor(score));
}

export function getPasswordStrengthLabel(score: number): string {
  if (score <= 1) return "Слабый";
  if (score <= 2) return "Средний";
  return "Надёжный";
}

/** Минимум символов для отправки формы. */
export const MIN_PASSWORD_LENGTH = 8;

export function validatePasswordForSubmit(password: string): { ok: boolean; message?: string } {
  const trimmed = password.trim();
  if (trimmed.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, message: "Пароль должен содержать минимум 8 символов" };
  }
  if (trimmed !== password) {
    return { ok: false, message: "Уберите пробелы в начале или в конце пароля" };
  }
  return { ok: true };
}
