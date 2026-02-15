"""FastAPI dependencies: текущий пользователь, менеджер аватаров."""
from typing import Annotated

from fastapi import Depends, Header, HTTPException

from core.memory_manager import MemoryManager

# Глобальный менеджер памяти (MVP; в проде — инжект через app.state)
_avatar_manager = MemoryManager()


def get_avatar_manager() -> MemoryManager:
    return _avatar_manager


def get_current_user(
    x_user_id: Annotated[str | None, Header(alias="X-User-Id")] = None,
) -> dict:
    """Для MVP: пользователь задаётся заголовком X-User-Id. В проде — JWT/session."""
    if not x_user_id:
        # В dev разрешаем без пользователя — используем default
        return {"id": "default", "email": "dev@localhost", "tier": "free"}
    return {"id": x_user_id, "email": f"{x_user_id}@user", "tier": "free"}
