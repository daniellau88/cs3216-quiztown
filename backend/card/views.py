from rest_framework.decorators import api_view
from rest_framework.response import Response

from collection.models import Collection
from quiztown.common.decorators import convert_keys_to_item, validate_request_data
from quiztown.common.pagination import CustomPagination

from . import jobs, serializers
from .models import Card


@api_view(["GET", "POST"])
def list_or_create_card_view(request, *args, **kwargs):
    if request.method == "GET":
        return list_card_view(request, *args, **kwargs)
    elif request.method == "POST":
        return create_card_view(request, *args, **kwargs)


def list_card_view(request):
    # TODO: Custom conversion of GET request to object
    pk = int(request.GET.get("filters[collection_id]", 0))
    cards = Card.objects.all()

    if pk != 0:
        cards = cards.filter(collection_id=pk)

    paginator = CustomPagination()
    page = paginator.paginate_queryset(cards, request)
    if page is not None:
        serializer = serializers.CardSerializer(page, many=True)
        return paginator.get_paginated_response({"items": serializer.data})

    serializer = serializers.CardSerializer(cards, many=True)
    return Response({"items": serializer.data})


@validate_request_data(serializers.CardCreateSerializer)
@convert_keys_to_item({"pk": Collection})
def create_card_view(request, pk_item, serializer):
    serializer.save(collection_id=pk_item.id)
    return Response({"item": serializer.data})


@api_view(["GET", "PUT", "DELETE"])
@convert_keys_to_item({"pk": Card})
def get_or_update_or_delete_card_view(request, *args, **kwargs):
    if request.method == "GET":
        return get_card_view(request, *args, **kwargs)

    elif request.method == "PUT":
        return update_card_view(request, *args, **kwargs)

    elif request.method == "DELETE":
        return delete_card_view(request, *args, **kwargs)


def get_card_view(request, pk_item, *args, **kwargs):
    serializer = serializers.CardSerializer(pk_item)
    return Response({"item": serializer.data})


@validate_request_data(
    serializers.CardSerializer,
    is_update=True,
)
def update_card_view(request, pk_item, serializer, *args, **kwargs):
    serializer.save()
    return Response({"item": serializer.data})


def delete_card_view(request, pk_item, *args, **kwargs):
    pk_item.delete()
    return Response({})


@api_view(["POST"])
@validate_request_data(serializers.CardImportSerializer)
def import_card_view(request, serializer, pk, *args, **kwargs):
    file_key = serializer.data["file_key"]
    file_name = serializer.data["file_name"]

    card = jobs.import_card_from_image(file_key, pk, name=file_name)

    response_serializer = serializers.CardSerializer(card)
    return Response({"item": response_serializer.data})
