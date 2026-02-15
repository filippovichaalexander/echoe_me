"""Эндпоинты генерации музыки (Stable Audio и др.)."""
from fastapi import APIRouter, Depends

from api.dependencies import get_current_user

router = APIRouter()


@router.post("/from-prompt")
async def generate_from_prompt(
    body: dict,
    user: dict = Depends(get_current_user),
):
    """Генерация по текстовому промпту. TODO: интеграция Stable Audio API."""
    prompt = body.get("prompt", "")
    return {"status": "ok", "prompt": prompt, "audio_url": None}
