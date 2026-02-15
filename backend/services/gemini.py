"""Клиент Gemini API для диалога и анализа."""
import os
from typing import Optional

import httpx


async def generate_response(
    prompt: str,
    context: Optional[dict] = None,
    api_key: Optional[str] = None,
) -> Optional[str]:
    """Генерация ответа (диалог, объяснения)."""
    api_key = api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    # TODO: реализовать вызов Gemini API
    async with httpx.AsyncClient() as client:
        pass
    return None
