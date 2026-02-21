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


@router.post("/chat")
async def chat(
    body: dict | None = Body(None),
    user: dict = Depends(get_current_user),
    avatar_manager: MemoryManager = Depends(get_avatar_manager),
):
    """
    Умный чат с аватаром: сохраняет промпт и ответ как действие.
    Все диалоги одного пользователя аккумулируются в аватаре.
    creation_type (Полная композиция / Стем / Модификация) сохраняется
    для фильтрации истории в UI по выбранной сущности.
    """
    body = body or {}
    message = (body.get("message") or "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="message обязателен")
    creation_type = (body.get("creation_type") or "").strip() or None
    avatar = avatar_manager.get_or_create_avatar(user["id"])
    reply = _avatar_reply(avatar, message)
    action_data = {
        "type": "chat",
        "input_type": "text",
        "input": {
            "prompt": message,
            "source": "wizard",
            "creation_type": creation_type,
        },
        "output": {"response": reply},
        "context": {"channel": "wizard", "creation_type": creation_type},
    }
    avatar.add_action(action_data)
    avatar_manager.save_avatar(user["id"], avatar)
    return {"response": reply}


@router.get("/chat/history")
async def chat_history(
    limit: int = 50,
    creation_type: str | None = None,
    user: dict = Depends(get_current_user),
    avatar_manager: MemoryManager = Depends(get_avatar_manager),
):
    """
    История диалога с аватаром. Если передан creation_type (Полная композиция /
    Стем / Модификация), возвращаются только сообщения этой сущности для UI.
    """
    avatar = avatar_manager.get_avatar(user["id"])
    if not avatar:
        return {"messages": []}
    actions = getattr(avatar, "action_history", [])
    filter_type = (creation_type or "").strip() or None

    def _ts(t):
        return t.isoformat() if hasattr(t, "isoformat") else str(t)

    def _matches(a):
        if a.get("action_type") != "chat":
            return False
        if not filter_type:
            return True
        inp = a.get("input_content") or {}
        ctx = a.get("context") or {}
        return inp.get("creation_type") == filter_type or ctx.get("creation_type") == filter_type

    chat_entries = [
        {
            "id": a.get("id"),
            "timestamp": _ts(a.get("timestamp")),
            "prompt": (a.get("input_content") or {}).get("prompt"),
            "response": (a.get("output_content") or {}).get("response"),
        }
        for a in reversed(actions)
        if _matches(a)
    ]
    return {"messages": chat_entries[:limit]}


def _avatar_reply(avatar, message: str) -> str:
    """Формирует ответ аватара по сообщению пользователя (учитывает память)."""
    stats = getattr(avatar, "stats", {})
    total = stats.get("total_actions", 0)
    if total == 0:
        return (
            "Привет! Я твой музыкальный аватар. Пока я только учусь. "
            "Опиши, какую музыку ты любишь или что хочешь создать — я буду это учитывать."
        )
    return (
        f"Учту твой запрос: «{message[:80]}{'…' if len(message) > 80 else ''}». "
        "Чем больше ты общаешься и создаёшь музыку — тем точнее я буду подстраиваться под тебя."
    )
