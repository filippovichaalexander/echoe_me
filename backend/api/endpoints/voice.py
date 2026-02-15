"""Эндпоинты голосового ввода и анализа."""
from fastapi import APIRouter, Depends, UploadFile, File

from api.dependencies import get_current_user
from core.voice_analyzer import HybridVoiceAnalyzer

router = APIRouter()
_analyzer = HybridVoiceAnalyzer()


@router.post("/analyze")
async def analyze_voice(
    user: dict = Depends(get_current_user),
    file: UploadFile = File(...),
):
    """Анализ загруженного голосового фрагмента."""
    # MVP: не читаем файл, возвращаем заглушку
    tier = user.get("tier", "free")
    result = _analyzer.analyze("", user_tier=tier)
    return result
