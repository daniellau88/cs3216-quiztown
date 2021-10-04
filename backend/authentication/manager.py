from __future__ import annotations

from .models import GoogleAuthentication


def get_google_auth_by_sub(sub: str) -> GoogleAuthentication | None:
    try:
        return GoogleAuthentication.objects.get(sub=sub)
    except GoogleAuthentication.DoesNotExist:
        return None
