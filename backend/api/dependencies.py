"""FastAPI dependencies: текущий пользователь из сессии, менеджер аватаров."""
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException

from core.auth import SESSION_COOKIE_NAME, get_session, get_user_by_id
from core.memory_manager import MemoryManager

_avatar_manager = MemoryManager()


def get_avatar_manager() -> MemoryManager:
    return _avatar_manager


def get_current_user(
    session_id: Annotated[str | None, Cookie(alias=SESSION_COOKIE_NAME)] = None,
) -> dict:
    """Текущий пользователь из cookie сессии. Для защищённых эндпоинтов."""
    session = get_session(session_id) if session_id else None
    if not session:
        raise HTTPException(status_code=401, detail="Не авторизован")
    user = get_user_by_id(session["user_id"])
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return {"id": user["id"], "email": user["email"], "name": user.get("name"), "tier": "free"}
