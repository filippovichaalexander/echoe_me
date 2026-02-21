/** Хранение голосовой записи в sessionStorage/localStorage */

const VOICE_STORAGE_KEY_PREFIX = "wizard_voice_description_";
const VOICE_STORAGE_MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export function voiceStorageKey(projectId: string): string {
  return VOICE_STORAGE_KEY_PREFIX + projectId;
}

export function saveVoiceToStorage(blob: Blob, projectId: string): void {
  if (blob.size > VOICE_STORAGE_MAX_BYTES) return;
  const key = voiceStorageKey(projectId);
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = (reader.result as string)?.split(",")[1];
    if (base64) {
      try {
        sessionStorage.setItem(key, base64);
        localStorage.setItem(key, base64);
      } catch {
        try {
          sessionStorage.setItem(key, base64);
        } catch {
          //
        }
      }
    }
  };
  reader.readAsDataURL(blob);
}

export function loadVoiceFromStorage(projectId: string): Blob | null {
  const key = voiceStorageKey(projectId);
  try {
    const base64 = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (!base64) return null;
    const bin = atob(base64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: "audio/webm" });
  } catch {
    return null;
  }
}

export function clearVoiceFromStorage(projectId: string): void {
  const key = voiceStorageKey(projectId);
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {
    //
  }
}
