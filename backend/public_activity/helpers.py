import rest_framework.request

from django.db.models.query import QuerySet

from .models import PublicActivity


def get_default_public_activity_queryset_by_request(request: rest_framework.request.Request) -> QuerySet:
    user = request.user
    if not user.is_authenticated:
        return PublicActivity.objects.none()
    return PublicActivity.objects.filter(user_id=user.user_id)
