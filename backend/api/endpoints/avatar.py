"""Эндпоинты аватара: действия, профиль, генерация, объяснения."""
from fastapi import APIRouter, Depends, HTTPException, Body

from api.dependencies import get_current_user, get_avatar_manager
from core.memory_manager import MemoryManager

router = APIRouter()


@router.post("/action")
async def add_action(
    action_data: dict,
    user: dict = Depends(get_current_user),
    avatar_manager: MemoryManager = Depends(get_avatar_manager),
):
    """Добавить действие пользователя."""
    avatar = avatar_manager.get_or_create_avatar(user["id"])
    avatar.add_action(action_data)
    avatar_manager.save_avatar(user["id"], avatar)
    return {"status": "success", "action_id": action_data.get("id")}


@router.get("/profile")
async def get_profile(
    user: dict = Depends(get_current_user),
    avatar_manager: MemoryManager = Depends(get_avatar_manager),
):
    """Получить профиль аватара (создаёт аватар при первом запросе)."""
    avatar = avatar_manager.get_or_create_avatar(user["id"])
    return avatar.get_user_profile_summary()


@router.post("/generate")
async def generate_music(
    body: dict | None = Body(None),
    user: dict = Depends(get_current_user),
    avatar_manager: MemoryManager = Depends(get_avatar_manager),
):
    """Сгенерировать музыку на основе аватара (заглушка: возвращаем вектор)."""
    context = (body or {}).get("context") if isinstance(body, dict) else None
    avatar = avatar_manager.get_avatar(user["id"])
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    music_vector = avatar.get_music_vector(context)
    # TODO: вызов Stable Audio API
    action_data = {
        "type": "generate",
        "input": {"context": context or {}},
        "output": {"audio_url": None, "vector": music_vector.tolist()},
    }
    avatar.add_action(action_data)
    avatar_manager.save_avatar(user["id"], avatar)
    return {"audio_url": None, "vector": music_vector.tolist(), "explanation": None}


@router.post("/explain")
async def explain_decision(
    body: dict | None = Body(None),
    user: dict = Depends(get_current_user),
    avatar_manager: MemoryManager = Depends(get_avatar_manager),
):
    """Объяснить музыкальное решение."""
    body = body or {}
    avatar = avatar_manager.get_avatar(user["id"])
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    return avatar.explain_decision(body.get("decision", {}), body.get("context", {}))
