"""Хранилище библиотеки пользователя (in-memory + JSON для персистентности)."""
import json
import secrets
from pathlib import Path
from typing import Any

_library_file = Path(__file__).resolve().parent.parent / "data" / "library.json"
_store: dict[str, list[dict]] = {}


def _load() -> None:
    global _store
    if _library_file.exists():
        try:
            data = json.loads(_library_file.read_text(encoding="utf-8"))
            _store = {k: v for k, v in data.items() if isinstance(v, list)}
        except Exception:
            _store = {}
    else:
        _store = {}


def _save() -> None:
    _library_file.parent.mkdir(parents=True, exist_ok=True)
    _library_file.write_text(json.dumps(_store, ensure_ascii=False, indent=2), encoding="utf-8")


_load()


def get_tracks(user_id: str) -> list[dict]:
    return list(_store.get(user_id, []))


def add_track(user_id: str, url: str, name: str | None = None, prompt: str | None = None) -> dict:
    if user_id not in _store:
        _store[user_id] = []
    track = {
        "id": secrets.token_hex(8),
        "user_id": user_id,
        "url": url,
        "name": (name or "").strip() or "Без названия",
        "prompt": (prompt or "").strip() or "",
        "created_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "size_bytes": 0,
    }
    _store[user_id].append(track)
    _save()
    return track


def delete_track(user_id: str, track_id: str) -> bool:
    tracks = _store.get(user_id, [])
    for i, t in enumerate(tracks):
        if t.get("id") == track_id:
            tracks.pop(i)
            _save()
            return True
    return False


def get_usage(user_id: str) -> dict[str, Any]:
    tracks = _store.get(user_id, [])
    total_mb = sum((t.get("size_bytes") or 0) for t in tracks) / (1024 * 1024)
    return {
        "total_storage_mb": round(total_mb, 2),
        "tracks": len(tracks),
        "albums": 0,
        "projects": 0,
        "samples": 0,
    }
