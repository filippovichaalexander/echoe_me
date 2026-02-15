"""API тарифа и квоты библиотеки."""
from fastapi import APIRouter, Depends

from api.dependencies import get_current_user
from models.subscription import get_limits_for_tier, check_quota
from services.library_store import get_usage

router = APIRouter()


@router.get("/")
async def get_subscription(user: dict = Depends(get_current_user)):
    """Тариф пользователя, текущее использование и лимиты."""
    tier = user.get("tier", "free")
    usage = get_usage(user["id"])
    limits = get_limits_for_tier(tier)
    quota = check_quota(tier, usage)
    return {
        "tier": tier,
        "usage": usage,
        "limits": limits,
        "within_limits": quota["within_limits"],
        "warnings": quota.get("warnings", []),
    }
