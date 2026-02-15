"""Лимиты по тарифам для библиотеки (в соответствии с Readme_my_library)."""
from enum import Enum
from typing import Any


class UserTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    PRO = "pro"


def _limit_value(v: Any, default_num: int = 0) -> int | str:
    if v == "unlimited":
        return "unlimited"
    return int(v) if v is not None else default_num


# Лимиты по тарифам (адаптировано под приложение)
TIER_LIMITS: dict[str, dict[str, Any]] = {
    UserTier.FREE: {
        "total_storage_mb": 100,
        "max_file_size_mb": 10,
        "max_tracks": 10,
        "max_projects": 3,
        "max_albums": 1,
        "max_samples": 20,
        "version_history_days": 7,
        "can_export": False,
    },
    UserTier.PREMIUM: {
        "total_storage_mb": 1024,
        "max_file_size_mb": 50,
        "max_tracks": 100,
        "max_projects": 30,
        "max_albums": 10,
        "max_samples": 200,
        "version_history_days": 30,
        "can_export": True,
        "export_formats": ["mp3", "wav"],
    },
    UserTier.PRO: {
        "total_storage_mb": 10240,
        "max_file_size_mb": 200,
        "max_tracks": 1000,
        "max_projects": "unlimited",
        "max_albums": "unlimited",
        "max_samples": "unlimited",
        "version_history_days": 365,
        "can_export": True,
        "export_formats": ["mp3", "wav", "flac", "aiff"],
        "can_collaborate": True,
    },
}


def get_limits_for_tier(tier: str) -> dict[str, Any]:
    try:
        t = UserTier(tier)
    except ValueError:
        t = UserTier.FREE
    return TIER_LIMITS[t].copy()


def check_quota(tier: str, usage: dict[str, Any]) -> dict[str, Any]:
    limits = get_limits_for_tier(tier)
    warnings = []
    exceeded = []
    for key in ["max_tracks", "max_albums", "max_projects", "max_samples", "total_storage_mb"]:
        if key not in limits or key not in usage:
            continue
        limit = limits[key]
        value = usage.get(key, 0)
        if limit != "unlimited" and value > limit:
            exceeded.append(key)
            warnings.append(f"Превышен лимит {key}: {value}/{limit}")
    return {
        "within_limits": len(exceeded) == 0,
        "exceeded": exceeded,
        "warnings": warnings,
        "current_usage": usage,
        "limits": limits,
    }
