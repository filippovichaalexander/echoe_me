/**
 * Векторные операции для визуализации и сравнения.
 */

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export function normalize(v: number[]): number[] {
  const len = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return len === 0 ? v : v.map((x) => x / len);
}
