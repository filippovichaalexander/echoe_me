"""
Цифровой музыкальный аватар пользователя.
Многоуровневая память + векторные представления (MVP).
"""
import hashlib
import json
import random
from collections import defaultdict, deque
from datetime import datetime
from typing import Dict, List, Optional, Any

import numpy as np


class TasteAvatar:
    """
    Цифровой музыкальный аватар пользователя.
    Многоуровневая память + векторные представления.
    """

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.created_at = datetime.now()
        self.last_updated = datetime.now()

        self.memory = {
            "session": deque(maxlen=50),
            "contextual": {
                "time_morning": [],
                "time_evening": [],
                "mood_happy": [],
                "mood_sad": [],
                "activity_work": [],
                "activity_relax": [],
            },
            "global": {
                "genre_distribution": defaultdict(int),
                "instrument_preferences": defaultdict(int),
                "tempo_distribution": defaultdict(int),
                "mood_timeline": [],
            },
            "emotional_patterns": defaultdict(list),
            "time_patterns": {
                "hourly": defaultdict(list),
                "weekly": defaultdict(list),
                "monthly": defaultdict(list),
            },
            "creative_patterns": {
                "generation_styles": [],
                "modification_preferences": defaultdict(int),
                "experimentation_rate": 0.0,
            },
        }

        self.vectors = {
            "taste": np.zeros(256),
            "mood": np.zeros(64),
            "style": np.zeros(128),
            "instrumentation": np.zeros(96),
            "context_bank": {},
            "history": [],
        }

        self.action_history: List[Dict] = []
        self.serendipity_level = 0.2
        self.learning_rate = 0.1
        self.context_weight = 0.3
        self.discovery_history = []

        self.psychological_profile = {
            "creativity_style": None,
            "risk_tolerance": 0.5,
            "consistency_score": 0.0,
            "mood_volatility": 0.0,
            "preferred_complexity": 0.5,
        }

        self.stats = {
            "total_actions": 0,
            "generation_count": 0,
            "modification_count": 0,
            "analysis_count": 0,
            "avg_session_duration": 0.0,
            "last_active": datetime.now(),
            "streak_days": 0,
        }

    def add_action(self, action_data: Dict) -> None:
        """Добавляет действие в историю и обновляет память."""
        action_id = f"{self.user_id}_{datetime.now().timestamp()}_{len(self.action_history)}"
        timestamp = datetime.now()

        action_record = {
            "id": action_id,
            "timestamp": timestamp,
            "action_type": action_data.get("type", "unknown"),
            "input_type": action_data.get("input_type", "unknown"),
            "input_content": action_data.get("input", {}),
            "output_content": action_data.get("output", {}),
            "context": self._extract_context(action_data),
            "user_feedback": action_data.get("feedback"),
            "embedding": self._create_action_embedding(action_data),
            "metadata": {
                "duration_seconds": action_data.get("duration", 0),
                "success": action_data.get("success", True),
                "platform": action_data.get("platform", "web"),
                "device_type": action_data.get("device", "desktop"),
            },
        }

        self.action_history.append(action_record)
        self.memory["session"].append(action_record)
        self._update_contextual_memory(action_record)
        self._update_global_trends(action_record)
        if action_record["context"].get("mood"):
            self.memory["emotional_patterns"][action_record["context"]["mood"]].append(
                {"action": action_record["action_type"], "timestamp": timestamp}
            )
        self._update_time_patterns(action_record, timestamp)
        self._update_vectors(action_record)
        self._update_stats(action_record)
        self.last_updated = timestamp

    def get_music_vector(self, context: Optional[Dict] = None) -> np.ndarray:
        """Вектор для генерации музыки с учётом контекста и серендипити."""
        base = self._calculate_base_vector()
        if context and self.vectors["context_bank"]:
            ctx_key = str(hash(json.dumps(context, sort_keys=True)))
            if ctx_key in self.vectors["context_bank"]:
                base = 0.7 * base + 0.3 * self.vectors["context_bank"][ctx_key]
        if random.random() < self.serendipity_level:
            noise = np.random.randn(256) * 0.1
            base = base + noise
        norm = np.linalg.norm(base)
        return base / norm if norm > 0 else base

    def explain_decision(self, decision: Dict, context: Dict) -> Dict:
        """Объяснение музыкального решения."""
        return {
            "timestamp": datetime.now().isoformat(),
            "decision": decision,
            "context": context,
            "sources": [],
            "patterns": [],
            "confidence": 0.7,
            "alternative_options": [],
        }

    def get_user_profile_summary(self) -> Dict:
        """Сводка профиля для UI."""
        return {
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "stats": self.stats,
            "preferences": {
                "top_genres": dict(list(self.memory["global"]["genre_distribution"].items())[:3]),
                "top_instruments": dict(list(self.memory["global"]["instrument_preferences"].items())[:3]),
            },
            "psychological_profile": self.psychological_profile,
            "avatar_health": {
                "data_points": len(self.action_history),
                "consistency_score": self.psychological_profile["consistency_score"],
            },
        }

    def _extract_context(self, action_data: Dict) -> Dict:
        return {
            "time_of_day": datetime.now().hour,
            "day_of_week": datetime.now().weekday(),
            "mood": action_data.get("mood"),
            "activity": action_data.get("activity"),
            "location": action_data.get("location", "unknown"),
        }

    def _create_action_embedding(self, action_data: Dict) -> np.ndarray:
        content_str = json.dumps(action_data.get("input", {}), sort_keys=True)
        h = hashlib.md5(content_str.encode()).hexdigest()
        np.random.seed(int(h[:8], 16) % (2**32))
        return np.random.randn(256)

    def _update_contextual_memory(self, action_record: Dict) -> None:
        ctx = action_record["context"]
        hour = ctx.get("time_of_day", 12)
        time_key = "time_morning" if hour < 12 else "time_evening"
        if time_key in self.memory["contextual"]:
            self.memory["contextual"][time_key].append(action_record)
            if len(self.memory["contextual"][time_key]) > 20:
                self.memory["contextual"][time_key].pop(0)
        if ctx.get("mood"):
            mood_key = f"mood_{ctx['mood']}"
            if mood_key not in self.memory["contextual"]:
                self.memory["contextual"][mood_key] = []
            self.memory["contextual"][mood_key].append(action_record)

    def _update_global_trends(self, action_record: Dict) -> None:
        out = action_record.get("output_content", {})
        for g in out.get("genres", []):
            self.memory["global"]["genre_distribution"][g] += 1
        for i in out.get("instruments", []):
            self.memory["global"]["instrument_preferences"][i] += 1
        if "tempo" in out:
            b = round(out["tempo"] / 10) * 10
            self.memory["global"]["tempo_distribution"][b] += 1

    def _update_time_patterns(self, action_record: Dict, timestamp: datetime) -> None:
        self.memory["time_patterns"]["hourly"][timestamp.hour].append(action_record)
        self.memory["time_patterns"]["weekly"][timestamp.weekday()].append(action_record)

    def _update_vectors(self, action_record: Dict) -> None:
        emb = action_record["embedding"]
        if len(emb) < 256:
            emb = np.pad(emb, (0, 256 - len(emb)))
        else:
            emb = emb[:256]
        self.vectors["taste"] = (1 - self.learning_rate) * self.vectors["taste"] + self.learning_rate * emb

    def _update_stats(self, action_record: Dict) -> None:
        self.stats["total_actions"] += 1
        self.stats["last_active"] = action_record["timestamp"]
        t = action_record["action_type"]
        if t == "generate":
            self.stats["generation_count"] += 1
        elif t == "modify":
            self.stats["modification_count"] += 1
        elif t == "analyze":
            self.stats["analysis_count"] += 1

    def _calculate_base_vector(self) -> np.ndarray:
        v = self.vectors["taste"]
        if len(v) != 256:
            v = np.pad(v, (0, max(0, 256 - len(v))))[:256]
        norm = np.linalg.norm(v)
        return v / norm if norm > 0 else v
