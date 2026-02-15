"""
Управление памятью аватара: загрузка/сохранение, кеширование.
"""
from typing import Optional, Dict, Any

from core.avatar import TasteAvatar


class MemoryManager:
    """Менеджер памяти аватаров (in-memory для MVP, далее — БД/Redis)."""

    def __init__(self):
        self._avatars: Dict[str, TasteAvatar] = {}

    def get_avatar(self, user_id: str) -> Optional[TasteAvatar]:
        return self._avatars.get(user_id)

    def get_or_create_avatar(self, user_id: str) -> TasteAvatar:
        if user_id not in self._avatars:
            self._avatars[user_id] = TasteAvatar(user_id=user_id)
        return self._avatars[user_id]

    def save_avatar(self, user_id: str, avatar: TasteAvatar) -> None:
        self._avatars[user_id] = avatar
