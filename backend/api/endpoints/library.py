"""API библиотеки: треки, лимиты по тарифам."""
from fastapi import APIRouter, Depends, HTTPException, Body

from api.dependencies import get_current_user
from models.subscription import get_limits_for_tier, check_quota
from services.library_store import get_tracks, add_track, delete_track, get_usage

router = APIRouter()


@router.get("/tracks")
async def list_tracks(user: dict = Depends(get_current_user)):
    """Список треков в библиотеке пользователя."""
    return get_tracks(user["id"])


@router.post("/tracks")
async def save_track(
    body: dict | None = Body(None),
    user: dict = Depends(get_current_user),
):
    """Добавить трек в библиотеку (url обязателен)."""
    data = body or {}
    url = (data.get("url") or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="url обязателен")
    usage = get_usage(user["id"])
    limits = get_limits_for_tier(user.get("tier", "free"))
    if usage["tracks"] >= limits["max_tracks"]:
        raise HTTPException(
            status_code=400,
            detail=f"Достигнут лимит треков ({limits['max_tracks']}) для вашего тарифа",
        )
    track = add_track(
        user["id"],
        url=url,
        name=data.get("name"),
        prompt=data.get("prompt"),
    )
    return track


@router.delete("/tracks/{track_id}")
async def remove_track(
    track_id: str,
    user: dict = Depends(get_current_user),
):
    """Удалить трек из библиотеки."""
    if not delete_track(user["id"], track_id):
        raise HTTPException(status_code=404, detail="Трек не найден")
    return {"status": "ok"}
