from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import PermissionDenied

from user import manager as user_manager

from . import manager as auth_manager


class GoogleAuthenticationBackend(BaseBackend):
    def authenticate(self, request, google_sub: str = ""):
        auth = auth_manager.get_google_auth_by_sub(google_sub)
        if auth is not None:
            user = user_manager.get_user_by_user_id(auth.user_id)
            return user
        raise PermissionDenied

    def get_user(self, user_id):
        return user_manager.get_user_by_user_id(user_id)
