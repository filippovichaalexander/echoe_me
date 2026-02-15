"""
Простая аутентификация: пользователи в файле, сессии в памяти, cookie.
Хеширование паролей через Argon2 (без лимита длины, рекомендуется OWASP).
"""
import json
import secrets
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Меньший time_cost — быстрее ответ при регистрации/логине (для прода можно увеличить)
_hasher = PasswordHasher(time_cost=1, memory_cost=65536)

# Пользователи: загружаются/сохраняются в JSON (переживают перезапуск)
_users: dict[str, dict] = {}
_users_file = Path(__file__).resolve().parent.parent / "data" / "users.json"
_sessions: dict[str, dict] = {}
SESSION_COOKIE_NAME = "music_avatar_session"
SESSION_MAX_AGE = 60 * 60 * 24 * 7  # 7 дней


def _load_users() -> None:
    global _users
    if _users_file.exists():
        try:
            data = json.loads(_users_file.read_text(encoding="utf-8"))
            _users = {k: v for k, v in data.items() if isinstance(v, dict) and "password_hash" in v}
        except Exception:
            _users = {}


def _save_users() -> None:
    _users_file.parent.mkdir(parents=True, exist_ok=True)
    _users_file.write_text(json.dumps(_users, ensure_ascii=False, indent=2), encoding="utf-8")


_load_users()


def hash_password(password: str) -> str:
    if not isinstance(password, str):
        password = str(password)
    return _hasher.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    if not isinstance(plain, str):
        plain = str(plain)
    try:
        _hasher.verify(hashed, plain)
        return True
    except (VerifyMismatchError, Exception):
        return False


def create_user(name: str, email: str, password: str) -> dict:
    email_lower = email.strip().lower()
    if email_lower in _users:
        raise ValueError("Пользователь с таким email уже зарегистрирован")
    user_id = secrets.token_hex(12)
    _users[email_lower] = {
        "id": user_id,
        "name": name.strip(),
        "email": email_lower,
        "password_hash": hash_password(password),
    }
    _save_users()
    return _users[email_lower].copy()


def get_user_by_email(email: str) -> Optional[dict]:
    return _users.get(email.strip().lower())


def get_user_by_id(user_id: str) -> Optional[dict]:
    for u in _users.values():
        if u["id"] == user_id:
            return {k: v for k, v in u.items() if k != "password_hash"}
    return None


def create_session(user_id: str) -> str:
    session_id = secrets.token_urlsafe(32)
    _sessions[session_id] = {
        "user_id": user_id,
        "expires": datetime.utcnow() + timedelta(seconds=SESSION_MAX_AGE),
    }
    return session_id


def get_session(session_id: str) -> Optional[dict]:
    if not session_id:
        return None
    data = _sessions.get(session_id)
    if not data or datetime.utcnow() > data["expires"]:
        if session_id in _sessions:
            del _sessions[session_id]
        return None
    return data


def delete_session(session_id: str) -> None:
    _sessions.pop(session_id, None)
