"""Хранилище библиотеки пользователя (in-memory + JSON для персистентности)."""
import json
import secrets
from pathlib import Path
from typing import Any

_library_file = Path(__file__).resolve().parent.parent / "data" / "library.json"
_projects_file = Path(__file__).resolve().parent.parent / "data" / "library_projects.json"
_store: dict[str, list[dict]] = {}
_projects_store: dict[str, list[dict]] = {}


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


def _load_projects() -> None:
    global _projects_store
    if _projects_file.exists():
        try:
            data = json.loads(_projects_file.read_text(encoding="utf-8"))
            _projects_store = {k: v for k, v in data.items() if isinstance(v, list)}
        except Exception:
            _projects_store = {}
    else:
        _projects_store = {}


def _save_projects() -> None:
    _projects_file.parent.mkdir(parents=True, exist_ok=True)
    _projects_file.write_text(
        json.dumps(_projects_store, ensure_ascii=False, indent=2), encoding="utf-8"
    )


_load()
_load_projects()


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


def get_projects(user_id: str) -> list[dict]:
    """Список проектов пользователя (из библиотеки)."""
    return list(_projects_store.get(user_id, []))


def add_project(user_id: str, name: str) -> dict:
    """Создать проект. name должен быть без пробелов и провалидирован на бэкенде."""
    if user_id not in _projects_store:
        _projects_store[user_id] = []
    name_clean = (name or "").strip()
    if not name_clean:
        name_clean = "Проект"
    project = {
        "id": secrets.token_hex(8),
        "user_id": user_id,
        "name": name_clean,
        "created_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "files": [],
    }
    _projects_store[user_id].append(project)
    _save_projects()
    return project


def get_usage(user_id: str) -> dict[str, Any]:
    tracks = _store.get(user_id, [])
    projects = _projects_store.get(user_id, [])
    total_mb = sum((t.get("size_bytes") or 0) for t in tracks) / (1024 * 1024)
    return {
        "total_storage_mb": round(total_mb, 2),
        "tracks": len(tracks),
        "albums": 0,
        "projects": len(projects),
        "samples": 0,
    }
