import rest_framework.request

from django.db.models.query import QuerySet

from collection import helpers as collection_helpers

from .models import Card


def get_default_card_queryset_by_request(request: rest_framework.request.Request) -> QuerySet:
    collection_ids = collection_helpers.get_default_collection_queryset_by_request(
        request).values_list("id", flat=True)
    return Card.objects.filter(collection_id__in=collection_ids)
