from rest_framework.decorators import api_view
from rest_framework.response import Response
from collection.models import Collection

from quiztown.common.decorators import convert_keys_to_item, validate_request_data
from quiztown.common.pagination import CustomPagination

from . import serializers
from .models import Card


@api_view(["GET", "POST"])
def list_or_create_card_view(request, *args, **kwargs):
    if request.method == "GET":
        return list_card_view(request, *args, **kwargs)
    elif request.method == "POST":
        return create_card_view(request, *args, **kwargs)


def list_card_view(request, pk):
    cards = Card.objects.filter(collection_id=pk)

    paginator = CustomPagination()
    page = paginator.paginate_queryset(cards, request)
    if page is not None:
        serializer = serializers.CardSerializer(page, many=True)
        return paginator.get_paginated_response({"cards": serializer.data})

    serializer = serializers.CardSerializer(cards, many=True)
    return Response({"cards": serializer.data})


@validate_request_data(serializers.CardCreateSerializer)
@convert_keys_to_item({"pk": Collection})
def create_card_view(request, pk_item, serializer):
    serializer.save(collection_id=pk_item.id)
    return Response({"card": serializer.data})


@api_view(["GET", "PUT", "DELETE"])
@convert_keys_to_item({"pkCard": Card})
def get_or_update_or_delete_card_view(request, *args, **kwargs):

    if request.method == "GET":
        return get_card_view(request, *args, **kwargs)

    elif request.method == "PUT":
        return update_card_view(request, *args, **kwargs)

    elif request.method == "DELETE":
        return delete_card_view(request, *args, **kwargs)


def get_card_view(request, pkCard_item, *args, **kwargs):
    serializer = serializers.CardSerializer(pkCard_item)
    return Response({"card": serializer.data})


@validate_request_data(
    serializers.CardSerializer,
    item_key="pkCard_item",
    is_update=True,
)
def update_card_view(request, pkCard_item, serializer, *args, **kwargs):
    serializer.save()
    return Response({"card": serializer.data})


def delete_card_view(request, pkCard_item, *args, **kwargs):
    pkCard_item.delete()
    return Response({})
