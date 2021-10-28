from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view
from rest_framework.response import Response

from collection import helpers as collection_helpers
from quiztown.common import utils
from quiztown.common.decorators import convert_keys_to_item, validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode

from . import helpers, serializers


@api_view(["GET", "POST"])
def list_or_create_card_view(request, *args, **kwargs):
    if request.method == "GET":
        return list_card_view(request, *args, **kwargs)
    elif request.method == "POST":
        return create_card_view(request, *args, **kwargs)


def list_card_view(request):
    return utils.filter_model_by_get_request(
        request,
        helpers.get_default_card_queryset_by_request(request),
        serializers.CardListSerializer,
        filter_serializer_class=serializers.CardListFilterSerializer,
        search_fields=["name"],
    )


@validate_request_data(serializers.CardCreateSerializer)
def create_card_view(request, serializer):
    collection_id = request.data["collection_id"]
    # Check if have permission to add to particular collection
    try:
        collection_helpers.get_editable_collection_queryset_by_request(
            request).get(id=collection_id)
    except ObjectDoesNotExist:
        raise ApplicationError(ErrorCode.NOT_FOUND, ["Item not found"])

    serializer.save()

    response_serializer = serializers.CardSerializer(
        serializer.instance, context={"request": request})
    return Response({"item": response_serializer.data})


@api_view(["GET", "PATCH", "DELETE"])
def get_or_update_or_delete_card_view(request, *args, **kwargs):
    if request.method == "GET":
        return get_card_view(request, *args, **kwargs)
    elif request.method == "PATCH":
        return update_card_view(request, *args, **kwargs)
    elif request.method == "DELETE":
        return delete_card_view(request, *args, **kwargs)


@convert_keys_to_item({"pk": helpers.get_default_card_queryset_by_request})
def get_card_view(request, pk_item, *args, **kwargs):
    serializer = serializers.CardSerializer(pk_item, context={"request": request})
    return Response({"item": serializer.data})


@convert_keys_to_item({"pk": helpers.get_editable_card_queryset_by_request})
@validate_request_data(
    serializers.CardUpdateSerializer,
    is_update=True,
    partial=True,
)
def update_card_view(request, pk_item, serializer, *args, **kwargs):
    serializer.save()

    response_serializer = serializers.CardSerializer(
        serializer.instance, context={"request": request})
    return Response({"item": response_serializer.data})


@convert_keys_to_item({"pk": helpers.get_editable_card_queryset_by_request})
def delete_card_view(request, pk_item, *args, **kwargs):
    pk_item.delete()
    return Response({})
