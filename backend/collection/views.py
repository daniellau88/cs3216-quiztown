from rest_framework.decorators import api_view
from rest_framework.response import Response

from quiztown.common.decorators import convert_keys_to_item, validate_request_data
from quiztown.common.pagination import CustomPagination

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

    paginator = CustomPagination()
    page = paginator.paginate_queryset(collections, request)
    if page is not None:
        serializer = serializers.CollectionSerializer(page, many=True)
        return paginator.get_paginated_response({"collections": serializer.data})

    serializer = serializers.CollectionSerializer(collections, many=True)
    return Response({"collections": serializer.data})


@validate_request_data(serializers.CollectionSerializer)
def create_collection_view(request, serializer):
    serializer.save()
    return Response({"collection": serializer.data})


@api_view(["GET", "PUT", "DELETE"])
@convert_keys_to_item({"pk": Collection})
def get_or_update_or_delete_collection_view(request, *args, **kwargs):
    if request.method == "GET":
        return get_collection_view(request, *args, **kwargs)
    elif request.method == "PUT":
        return update_collection_view(request, *args, **kwargs)
    elif request.method == "DELETE":
        return delete_collection_view(request, *args, **kwargs)


def get_collection_view(request, pk_item):
    serializer = serializers.CollectionSerializer(pk_item)
    return Response({"collection": serializer.data})


@validate_request_data(
    serializers.CollectionSerializer,
    is_update=True,
)
def update_collection_view(request, pk_item, serializer):
    serializer.save()
    return Response({"collection": serializer.data})


def delete_collection_view(request, pk_item):
    pk_item.delete()
    return Response({})
