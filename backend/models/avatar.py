"""Модели для хранения/сериализации аватара (MongoDB/SQL)."""
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime


class AvatarModel(BaseModel):
    """Сериализованное состояние TasteAvatar для БД."""
    user_id: str
    created_at: datetime
    last_updated: datetime
    memory: Dict[str, Any]
    vectors: Dict[str, Any]
    action_history_count: int
    stats: Dict[str, Any]
    psychological_profile: Dict[str, Any]
    parameters: Dict[str, float]

    class Config:
        from_attributes = True
