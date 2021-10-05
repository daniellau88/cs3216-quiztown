from rest_framework.decorators import api_view
from rest_framework.response import Response

from quiztown.common.decorators import validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode

from . import serializers
from .models import Collection


@api_view(["GET", "POST"])
def list_or_create_collection_view(request, *args, **kwargs):
    if request.method == "GET":
        return list_collections_view(request, *args, **kwargs)
    elif request.method == "POST":
        return create_collection_view(request, *args, **kwargs)


def list_collections_view(request):
    collections = Collection.objects.all()
    serializer = serializers.CollectionSerializer(collections, many=True)
    return Response({"collections": serializer.data})


@validate_request_data(serializers.CollectionSerializer)
def create_collection_view(request, serializer):
    serializer.save()
    return Response({"collection": serializer.data})


@api_view(["GET", "PUT", "DELETE"])
def get_or_update_or_delete_collection_view(request, pk, *args, **kwargs):
    try:
        collection = Collection.objects.get(pk=pk)
    except Collection.DoesNotExist:
        raise ApplicationError(ErrorCode.NOT_FOUND, ["Collection not found"])

    if request.method == "GET":
        return get_collection_view(request, collection, *args, **kwargs)

    elif request.method == "PUT":
        return update_collection_view(request, collection, *args, **kwargs)

    elif request.method == "DELETE":
        return delete_collection_view(request, collection, *args, **kwargs)


def get_collection_view(request, collection):
    serializer = serializers.CollectionSerializer(collection)
    return Response({"collection": serializer.data})


@validate_request_data(serializers.CollectionSerializer)
def update_collection_view(request, serializer, collection):
    serializer.save()
    return Response({"collection": serializer.data})


def delete_collection_view(request, collection):
    collection.delete()
    return Response({})
