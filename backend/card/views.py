from rest_framework.decorators import api_view
from rest_framework.response import Response
from collection.models import Collection

from quiztown.common.decorators import validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode

from . import serializers
from .models import Card


@api_view(["GET", "POST"])
def list_or_create_card_view(request, pk, *args, **kwargs):
    if request.method == "GET":
        return list_card_view(request, pk, *args, **kwargs)
    elif request.method == "POST":
        return create_card_view(request, pk, *args, **kwargs)


def list_card_view(request, pk):
    cards = Card.objects.get(collection_id=pk)
    serializer = serializers.CardSerializer(cards, many=True)
    return Response({"cards": serializer.data})


@validate_request_data(serializers.CardSerializer)
def create_card_view(request, pk, serializer):
    try:
        Collection.objects.get(id=pk)
    except Collection.DoesNotExist:
        raise ApplicationError(ErrorCode.NOT_FOUND, ["Collection not found"])

    serializer.save(collection_id=pk)
    return Response({"card": serializer.data})


@api_view(["GET", "PUT", "DELETE"])
def get_or_update_or_delete_card_view(request, pkCard, *args, **kwargs):
    try:
        card = Card.objects.get(pk=pkCard)
    except Card.DoesNotExist:
        raise ApplicationError(ErrorCode.NOT_FOUND, ["Card not found"])

    if request.method == "GET":
        return get_card_view(request, card, *args, **kwargs)

    elif request.method == "PUT":
        return update_card_view(request, card, *args, **kwargs)

    elif request.method == "DELETE":
        return delete_card_view(request, card, *args, **kwargs)


def get_card_view(request, card):
    serializer = serializers.CardSerializer(card)
    return Response({"card": serializer.data})


@validate_request_data(serializers.CardSerializer)
def update_card_view(request, serializer, card):
    serializer.save()
    return Response({"card": serializer.data})


def delete_card_view(request, card):
    card.delete()
    return Response({})


@api_view(["GET"])
def list_flagged_card_view(request, *args, **kwargs):
    cards = Card.objects.all()
    serializer = serializers.CardSerializer(cards, many=True)
    return Response({"cards": serializer.data})
