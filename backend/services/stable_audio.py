"""Клиент Stable Audio API для генерации музыки."""
import os
from typing import List, Optional

import httpx


async def generate_from_prompt(
    prompt: str,
    duration: float = 10.0,
    api_key: Optional[str] = None,
) -> Optional[str]:
    """Генерация аудио по текстовому промпту. Возвращает URL или путь к файлу."""
    api_key = api_key or os.getenv("STABLE_AUDIO_API_KEY")
    if not api_key:
        return None
    # TODO: реализовать вызов Stable Audio API
    async with httpx.AsyncClient() as client:
        pass
    return None


async def generate_from_vector(
    vector: List[float],
    api_key: Optional[str] = None,
) -> Optional[str]:
    """Генерация по вектору вкуса аватара."""
    api_key = api_key or os.getenv("STABLE_AUDIO_API_KEY")
    if not api_key:
        return None
    # TODO: маппинг вектора в параметры API
    return None
