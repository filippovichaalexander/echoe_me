"""API библиотеки: треки, проекты, лимиты по тарифам."""
import re
from fastapi import APIRouter, Depends, HTTPException, Body

from api.dependencies import get_current_user
from models.subscription import get_limits_for_tier, check_quota
from services.library_store import (
    get_tracks,
    add_track,
    delete_track,
    get_usage,
    get_projects,
    add_project,
)

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


def _validate_project_name(name: str) -> None:
    """Проверка имени проекта: без пробелов, допустимые символы, длина."""
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Имя проекта не может быть пустым")
    if " " in name:
        raise HTTPException(status_code=400, detail="В имени проекта нельзя использовать пробелы")
    if len(name) > 64:
        raise HTTPException(status_code=400, detail="Имя проекта не более 64 символов")
    # Буквы (латиница/кириллица), цифры, дефис, подчёркивание
    if not re.match(r"^[\w\-]+$", name, re.UNICODE) or not re.search(r"[a-zA-Zа-яА-ЯёЁ]", name):
        raise HTTPException(
            status_code=400,
            detail="Имя проекта: буквы, цифры, дефис и подчёркивание (без пробелов)",
        )


@router.get("/projects")
async def list_projects(user: dict = Depends(get_current_user)):
    """Список проектов пользователя (библиотека)."""
    return get_projects(user["id"])


@router.post("/projects")
async def create_project(
    body: dict | None = Body(None),
    user: dict = Depends(get_current_user),
):
    """Создать проект в библиотеке. name — обязательно, без пробелов."""
    data = body or {}
    name = (data.get("name") or "").strip()
    _validate_project_name(name)
    usage = get_usage(user["id"])
    limits = get_limits_for_tier(user.get("tier", "free"))
    max_projects = limits["max_projects"]
    if max_projects != "unlimited" and usage["projects"] >= max_projects:
        raise HTTPException(
            status_code=400,
            detail=f"Достигнут лимит проектов ({max_projects}) для вашего тарифа",
        )
    return add_project(user["id"], name)
