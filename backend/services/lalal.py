"""Клиент Lalal.ai API для сепарации стемов."""
import os
from typing import Optional, List

import httpx


async def separate_stems(
    audio_path: str,
    api_key: Optional[str] = None,
) -> Optional[List[str]]:
    """Разделение трека на стемы (вокал, бас, барабаны и т.д.)."""
    api_key = api_key or os.getenv("LALAL_API_KEY")
    if not api_key:
        return None
    # TODO: реализовать вызов Lalal.ai API
    async with httpx.AsyncClient() as client:
        pass
    return None
