"""Redis для кеширования."""
import os
from typing import Optional

import redis.asyncio as redis

_redis: Optional[redis.Redis] = None


async def get_redis() -> Optional[redis.Redis]:
    global _redis
    if _redis is not None:
        return _redis
    url = os.getenv("REDIS_URL")
    if not url:
        return None
    _redis = redis.from_url(url)
    return _redis


async def close_redis() -> None:
    global _redis
    if _redis:
        await _redis.close()
        _redis = None
