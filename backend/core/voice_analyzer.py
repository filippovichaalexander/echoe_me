"""
Гибридный анализатор голоса: нативные фичи + API (Whisper/Gemini) для премиум.
"""
from typing import Dict, Any


class HybridVoiceAnalyzer:
    """Гибридный анализ голоса: нативный + API."""

    def __init__(self):
        pass

    def analyze(self, audio_path: str, user_tier: str = "free") -> Dict[str, Any]:
        """
        Анализ аудио. Для MVP возвращаем нативные фичи-заглушки.
        Для premium можно добавить вызов Whisper + Gemini.
        """
        # MVP: заглушка нативного анализа
        native_features = {
            "energy": 0.5,
            "speech_rate": 0.5,
            "mood_guess": "neutral",
            "confidence": 0.6,
        }
        if user_tier == "premium":
            # TODO: api_analysis = self._call_whisper_and_gemini(audio_path)
            return {**native_features, "source": "hybrid"}
        return {**native_features, "source": "native"}
