"""Подключение к MongoDB (опционально)."""
import os
from typing import Optional

# Для MVP не подключаем motor/pymongo — используем in-memory.
# Раскомментировать при переходе на MongoDB:
# from motor.motor_asyncio import AsyncIOMotorClient
# client: Optional[AsyncIOMotorClient] = None
# def get_db():
#     return client.get_database(os.getenv("MONGODB_DB", "music_avatar"))


def get_db():
    return None
