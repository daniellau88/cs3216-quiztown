import rest_framework.request

from django.db.models import Q
from django.db.models.query import QuerySet

from .models import Collection, CollectionImport


def get_default_collection_queryset_by_request(request: rest_framework.request.Request) -> QuerySet:
    user = request.user
    or_filter = Q(private=Collection.PUBLIC)
    if user.is_authenticated:
        or_filter = or_filter | Q(owner_id=user.user_id)
    return Collection.objects.filter(or_filter)


def get_editable_collection_queryset_by_request(request: rest_framework.request.Request) -> QuerySet:
    user = request.user
    if not user.is_authenticated:
        return Collection.objects.none()
    return Collection.objects.filter(owner_id=user.user_id)


def get_default_collection_import_queryset_by_request(request: rest_framework.request.Request) -> QuerySet:
    # TODO: Change to cache if performance dies
    collection_ids = get_editable_collection_queryset_by_request(
        request).values_list("id", flat=True)
    return CollectionImport.objects.filter(collection_id__in=collection_ids)
