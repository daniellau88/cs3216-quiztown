from __future__ import annotations

from .models import User


def get_user_by_username_and_password(username: str, password: str) -> User | None:
    user = None
    try:
        user = User.objects.get(username=username, password=password)
    except User.DoesNotExist:
        # If no user, just return None
        pass

    return user
