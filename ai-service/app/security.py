from fastapi import Header

from app.config import get_settings
from app.errors import ApiError


async def require_internal_token(
    x_internal_service_token: str | None = Header(default=None, alias="X-Internal-Service-Token"),
) -> None:
    if x_internal_service_token != get_settings().ai_service_token:
        raise ApiError(401, "UNAUTHORIZED", "Invalid internal service token")
