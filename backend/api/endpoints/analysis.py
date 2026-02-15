"""Эндпоинты анализа треков (сепарация, метаданные)."""
from fastapi import APIRouter, Depends

from api.dependencies import get_current_user

router = APIRouter()


@router.post("/separate")
async def separate_stems(
    body: dict,
    user: dict = Depends(get_current_user),
):
    """Сепарация трека на стемы (Lalal.ai). TODO: интеграция."""
    return {"status": "ok", "stems": []}
