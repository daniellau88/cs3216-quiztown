from django.core.exceptions import ObjectDoesNotExist
from django.http import response
from rest_framework.decorators import api_view
from rest_framework.response import Response

from card.helpers import get_default_card_queryset_by_request
from collection import helpers as collection_helpers
from collection.models import Collection
from quiztown.common import utils
from quiztown.common.decorators import convert_keys_to_item, validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode

from . import jobs, serializers


@api_view(["GET", "POST"])
def list_or_create_card_view(request, *args, **kwargs):
    if request.method == "GET":
        return list_card_view(request, *args, **kwargs)
    elif request.method == "POST":
        return create_card_view(request, *args, **kwargs)


def list_card_view(request):
    return utils.filter_model_by_get_request(
        request,
        get_default_card_queryset_by_request(request),
        serializers.CardListSerializer,
        filter_serializer_class=serializers.CardListFilterSerializer,
        search_fields=["image_file_key", "name"],
    )


@validate_request_data(serializers.CardCreateSerializer)
def create_card_view(request, serializer):
    collection_id = request.data["collection_id"]
    # Check if have permission to add to particular collection
    try:
        collection_helpers.get_default_collection_queryset_by_request(
            request).get(id=collection_id)
    except ObjectDoesNotExist:
        raise ApplicationError(ErrorCode.NOT_FOUND, ["Item not found"])

    serializer.save()
    return Response({"item": serializer.data})


@api_view(["GET", "PATCH", "DELETE"])
@convert_keys_to_item({"pk": get_default_card_queryset_by_request})
def get_or_update_or_delete_card_view(request, *args, **kwargs):
    if request.method == "GET":
        return get_card_view(request, *args, **kwargs)

    # Only can edit own items
    if request.user.is_authenticated and request.method != "GET":
        collection_id = kwargs["pk_item"].collection_id
        collection = collection_helpers.get_default_collection_queryset_by_request(
            request).get(id=collection_id)
        assert isinstance(collection, Collection)
        if collection.owner_id != request.user.user_id:
            raise ApplicationError(ErrorCode.UNAUTHENTICATED, ["No permission to edit"])

    if request.method == "PATCH":
        return update_card_view(request, *args, **kwargs)

    elif request.method == "DELETE":
        return delete_card_view(request, *args, **kwargs)


def get_card_view(request, pk_item, *args, **kwargs):
    serializer = serializers.CardSerializer(pk_item)
    return Response({"item": serializer.data})


@validate_request_data(
    serializers.CardUpdateSerializer,
    is_update=True,
)
def update_card_view(request, pk_item, serializer, *args, **kwargs):
    serializer.save()

    response_serializer = serializers.CardSerializer(serializer.instance)
    return Response({"item": response_serializer.data})


def delete_card_view(request, pk_item, *args, **kwargs):
    pk_item.delete()
    return Response({})


# Deprecated
@api_view(["POST"])
@validate_request_data(serializers.CardImportImageSerializer)
def import_card_view(request, serializer, pk, *args, **kwargs):
    file_key = serializer.data["file_key"]
    file_name = serializer.data["file_name"]

    card = jobs.import_card_from_image(file_key, pk, name=file_name)

    response_serializer = serializers.CardSerializer(card)
    return Response({"item": response_serializer.data})
