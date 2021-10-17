import threading

from rest_framework.decorators import api_view
from rest_framework.response import Response
from card.models import Card

from quiztown.common import utils
from quiztown.common.decorators import convert_keys_to_item, validate_request_data

from . import jobs, serializers
from .models import Collection, CollectionImport


@api_view(["GET", "POST"])
def list_or_create_collection_view(request, *args, **kwargs):
    if request.method == "GET":
        return list_collections_view(request, *args, **kwargs)
    elif request.method == "POST":
        return create_collection_view(request, *args, **kwargs)


def list_collections_view(request):
    return utils.filter_model_by_get_request(
        request,
        Collection,
        serializers.CollectionSerializer,
    )


@validate_request_data(serializers.CollectionSerializer)
def create_collection_view(request, serializer):
    serializer.save()
    return Response({"item": serializer.data})


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
    return Response({"item": serializer.data})


@validate_request_data(
    serializers.CollectionSerializer,
    is_update=True,
)
def update_collection_view(request, pk_item, serializer):
    serializer.save()
    return Response({"item": serializer.data})


def delete_collection_view(request, pk_item):
    pk_item.delete()
    return Response({})


@api_view(["POST"])
@convert_keys_to_item({"pk": Collection})
def import_image_or_text_collection_view(request, *args, **kwargs):
    if "type" in request.data and request.data["type"] == Card.TEXT:
        return import_collection_text_view(request, *args, **kwargs)
    return import_collection_view(request, *args, **kwargs)


@validate_request_data(serializers.CollectionTextImportRequestSerializer)
def import_collection_text_view(request, pk_item, serializer):
    collection_text_import_instances = []

    for collection_text_import_data in serializer.data["imports"]:
        collection_text_import_serializer = serializers.CollectionTextImportCreateSerializer(
            data=collection_text_import_data)

        collection_text_import_serializer.is_valid()
        collection_text_import_serializer.save(collection_id=pk_item.id)

        collection_text_import = collection_text_import_serializer.instance

        collection_text_import_instances.append(collection_text_import)

        if isinstance(collection_text_import, Card):
            jobs.import_cards_from_text(collection_text_import)

    response_serializer = serializers.CollectionTextImportSerializer(
        collection_text_import_instances, many=True)

    return Response({"items": response_serializer.data})


@validate_request_data(serializers.CollectionImportRequestSerializer)
def import_collection_view(request, pk_item, serializer):
    collection_import_instances = []

    for collection_import_data in serializer.data["imports"]:
        collection_import_serializer = serializers.CollectionImportCreateSerializer(
            data=collection_import_data)

        collection_import_serializer.is_valid()
        collection_import_serializer.save(
            collection_id=pk_item.id, status=CollectionImport.IN_QUEUE)

        collection_import = collection_import_serializer.instance

        collection_import_instances.append(collection_import)

        # TODO: handle images too
        t = threading.Thread(target=jobs.import_cards_from_pdf,
                             args=(), kwargs={"collection_import": collection_import})
        t.setDaemon(True)
        t.start()

    response_serializer = serializers.CollectionImportSerializer(
        collection_import_instances, many=True)

    return Response({"items": response_serializer.data})


@api_view(["GET"])
def get_collection_import_view(request, pk, pkImport):
    collection_import = CollectionImport.objects.get(id=pkImport)
    serializer = serializers.CollectionImportSerializer(collection_import)
    return Response({"item": serializer.data})


@api_view(["GET"])
def list_collection_import_view(request, pk):
    imports = CollectionImport.objects.filter(collection_id=pk)
    # TODO: change filter format
    if "filter[is_reviewed]" in request.GET:
        filter = request.GET.get("filter[is_reviewed]")
        imports = imports.filter(is_reviewed=bool(filter))
    imports = imports.order_by("-created_at")
    serializer = serializers.CollectionImportSerializer(imports, many=True)
    return Response({"items": serializer.data})
