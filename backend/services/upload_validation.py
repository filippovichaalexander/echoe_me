"""
Валидация и безопасное сохранение загружаемых файлов (референсы: аудио и текст).
Основная проверка безопасности — на бэкенде; фронт выполняет только критическую валидацию.
"""
import re
import uuid
from pathlib import Path
from typing import Any

# --- Аудио (референсы шаг 3) ---
REFS_AUDIO_SPEC: dict[str, int] = {
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
}
REFS_AUDIO_EXTENSIONS = frozenset(REFS_AUDIO_SPEC.keys())

# --- Текст (шаг 8) ---
TEXT_SPEC: dict[str, int] = {
    ".txt": 5 * 1024 * 1024,
    ".md": 5 * 1024 * 1024,
    ".rtf": 10 * 1024 * 1024,
    ".pdf": 20 * 1024 * 1024,
}
TEXT_EXTENSIONS = frozenset(TEXT_SPEC.keys())
MAX_FILENAME_LENGTH = 255

# --- Голосовое описание (шаг 2 визарда): запись с устройства ---
VOICE_DESC_SPEC: dict[str, int] = {
    ".webm": 10 * 1024 * 1024,
    ".ogg": 10 * 1024 * 1024,
    ".mp4": 10 * 1024 * 1024,
}
VOICE_DESC_EXTENSIONS = frozenset(VOICE_DESC_SPEC.keys())

# Magic bytes (первые байты файла)
PDF_SIGNATURE = b"%PDF-"
RTF_SIGNATURES = (b"{\\rtf0", b"{\\rtf1")

_UPLOADS_DIR = Path(__file__).resolve().parent.parent / "data" / "uploads"


def _get_ext(filename: str) -> str:
    """Нормализованное расширение (нижний регистр с точкой)."""
    parts = (filename or "").split(".")
    if len(parts) < 2:
        return ""
    return "." + parts[-1].lower()


def _safe_basename(filename: str) -> str:
    """Безопасное имя: без path traversal и управляющих символов."""
    if not filename or len(filename) > MAX_FILENAME_LENGTH:
        return ""
    if re.search(r"[\x00-\x1f\x7f]|\.\.|[\/\\]", filename):
        return ""
    return filename.strip()


def validate_ref_audio(filename: str, content: bytes, content_type: str | None) -> str | None:
    """
    Валидация аудио-референса. Возвращает None при успехе, иначе сообщение об ошибке.
    """
    ext = _get_ext(filename)
    if ext not in REFS_AUDIO_EXTENSIONS:
        return "Формат не поддерживается. Допустимы: WAV, MP3, FLAC, AIFF, M4A, AAC, OGG, WEBM, MIDI."
    if _safe_basename(filename) == "":
        return "Недопустимое имя файла."
    max_size = REFS_AUDIO_SPEC.get(ext, 0)
    if len(content) > max_size:
        mb = max_size // (1024 * 1024)
        return f"Макс. размер для {ext}: {mb} MB."
    if len(content) == 0:
        return "Файл пустой."
    return None


def validate_ref_text(filename: str, content: bytes, content_type: str | None) -> str | None:
    """
    Валидация текстового файла (шаг 8). Проверка расширения, размера, magic bytes для PDF/RTF.
    """
    ext = _get_ext(filename)
    if ext not in TEXT_EXTENSIONS:
        return "Формат не поддерживается. Допустимы: TXT, MD, RTF, PDF."
    if _safe_basename(filename) == "":
        return "Недопустимое имя файла."
    max_size = TEXT_SPEC.get(ext, 0)
    if len(content) > max_size:
        mb = max_size // (1024 * 1024)
        return f"Макс. размер для {ext}: {mb} MB."
    if len(content) == 0:
        return "Файл пустой."
    # Подозрительные двойные расширения в имени (например file.pdf.exe)
    base = filename.rsplit(".", 1)[0]
    if re.search(r"\.(exe|bat|cmd|sh|js|vbs|scr|pif|com)$", base, re.I):
        return "Недопустимое имя файла."
    # Magic bytes для PDF и RTF
    head = content[:32]
    if ext == ".pdf":
        if not head.startswith(PDF_SIGNATURE):
            return "Файл не является корректным PDF."
    if ext == ".rtf":
        if not any(head.startswith(sig) for sig in RTF_SIGNATURES):
            return "Файл не является корректным RTF."
    return None


def validate_voice_description(filename: str, content: bytes) -> str | None:
    """Валидация голосовой записи (описание шаг 2)."""
    ext = _get_ext(filename)
    if ext not in VOICE_DESC_EXTENSIONS and ext not in (".blob", ""):
        ext = ".webm"
    max_size = VOICE_DESC_SPEC.get(ext, 10 * 1024 * 1024)
    if len(content) > max_size:
        return f"Макс. размер голосовой записи: {max_size // (1024 * 1024)} MB."
    if len(content) == 0:
        return "Запись пустая."
    return None


def save_upload(user_id: str, content: bytes, ext: str, prefix: str = "file") -> dict[str, Any]:
    """
    Сохраняет загруженный файл в data/uploads/{user_id}/{uuid}{ext}.
    Возвращает { "id", "path", "size", "original_ext" }.
    """
    _UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    safe_user = _safe_basename(user_id) or "anon"
    user_dir = _UPLOADS_DIR / safe_user
    user_dir.mkdir(parents=True, exist_ok=True)
    file_id = str(uuid.uuid4())
    safe_ext = ext.lower() if ext and re.match(r"^\.[a-z0-9]+$", ext.lower()) else ".bin"
    path = user_dir / f"{file_id}{safe_ext}"
    path.write_bytes(content)
    return {
        "id": file_id,
        "path": str(path.relative_to(_UPLOADS_DIR)),
        "size": len(content),
        "original_ext": safe_ext,
    }
