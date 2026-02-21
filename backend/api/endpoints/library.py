"""API библиотеки: треки, проекты, загрузка файлов (референсы)."""
import re
from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File

from api.dependencies import get_current_user
from models.subscription import get_limits_for_tier
from services.library_store import (
    get_tracks,
    add_track,
    delete_track,
    get_usage,
    get_projects,
    add_project,
)
from services.upload_validation import (
    validate_ref_audio,
    validate_ref_text,
    save_upload,
    REFS_AUDIO_EXTENSIONS,
    TEXT_EXTENSIONS,
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


# --- Загрузка файлов (валидация и безопасность на бэкенде) ---

MAX_UPLOAD_READ = 220 * 1024 * 1024  # чуть больше макс. размера одного файла (200 MB)


@router.post("/upload/ref-audio")
async def upload_ref_audio(
    file: UploadFile = File(..., description="Аудиофайл референса"),
    user: dict = Depends(get_current_user),
):
    """
    Загрузка аудио-референса (шаг 3 визарда).
    Валидация формата и размера на бэкенде; безопасное сохранение.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Имя файла отсутствует")
    content = await file.read()
    if len(content) > MAX_UPLOAD_READ:
        raise HTTPException(status_code=400, detail="Файл слишком большой")
    content_type = file.content_type or None
    err = validate_ref_audio(file.filename, content, content_type)
    if err:
        raise HTTPException(status_code=400, detail=err)
    ext = "." + (file.filename.split(".")[-1].lower() if "." in file.filename else "bin")
    if ext not in REFS_AUDIO_EXTENSIONS:
        ext = ".bin"
    result = save_upload(user["id"], content, ext, "ref-audio")
    result["name"] = file.filename
    return result


@router.post("/upload/ref-text")
async def upload_ref_text(
    file: UploadFile = File(..., description="Текстовый файл (txt, md, rtf, pdf)"),
    user: dict = Depends(get_current_user),
):
    """
    Загрузка текстового файла (шаг 8 визарда).
    Валидация формата, размера и magic bytes на бэкенде; безопасное сохранение.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Имя файла отсутствует")
    content = await file.read()
    if len(content) > MAX_UPLOAD_READ:
        raise HTTPException(status_code=400, detail="Файл слишком большой")
    content_type = file.content_type or None
    err = validate_ref_text(file.filename, content, content_type)
    if err:
        raise HTTPException(status_code=400, detail=err)
    ext = "." + (file.filename.split(".")[-1].lower() if "." in file.filename else "txt")
    if ext not in TEXT_EXTENSIONS:
        ext = ".txt"
    result = save_upload(user["id"], content, ext, "ref-text")
    result["name"] = file.filename
    return result
