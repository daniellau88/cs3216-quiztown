
from rest_framework.decorators import api_view
from rest_framework.response import Response

from card import serializers as card_serializers
from card.models import Card
from quiztown.common import utils
from quiztown.common.decorators import convert_keys_to_item, validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode

from . import helpers, jobs, serializers
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
        helpers.get_default_collection_queryset_by_request(request),
        serializers.CollectionSerializer,
        filter_serializer_class=serializers.CollectionListFilterSerializer,
        search_fields=["name"],
    )


@validate_request_data(serializers.CollectionCreateSerializer)
def create_collection_view(request, serializer):
    serializer.save(owner_id=request.user.id)

    response_serializer = serializers.CollectionSerializer(serializer.instance)
    return Response({"item": response_serializer.data})


@api_view(["GET", "PATCH", "DELETE"])
@convert_keys_to_item({"pk": helpers.get_default_collection_queryset_by_request})
def get_or_update_or_delete_collection_view(request, *args, **kwargs):
    if request.method == "GET":
        return get_collection_view(request, *args, **kwargs)

    # Only can edit own items
    if request.user.is_authenticated and request.method != "GET":
        if kwargs["pk_item"].owner_id != request.user.user_id:
            raise ApplicationError(ErrorCode.UNAUTHENTICATED, ["No permission to edit"])

    if request.method == "PATCH":
        return update_collection_view(request, *args, **kwargs)
    elif request.method == "DELETE":
        return delete_collection_view(request, *args, **kwargs)


def get_collection_view(request, pk_item):
    serializer = serializers.CollectionSerializer(pk_item)
    return Response({"item": serializer.data})


@validate_request_data(
    serializers.CollectionUpdateSerializer,
    is_update=True,
)
def update_collection_view(request, pk_item, serializer):
    serializer.save()

    response_serializer = serializers.CollectionSerializer(serializer.instance)
    return Response({"item": response_serializer.data})


def delete_collection_view(request, pk_item):
    pk_item.delete()
    return Response({})


@api_view(["POST"])
@convert_keys_to_item({"pk": helpers.get_default_collection_queryset_by_request})
@validate_request_data(serializers.CollectionImportRequestSerializer)
def import_file_collection_view(request, pk_item, serializer):
    # Only can edit own items
    if request.user.is_authenticated and request.method != "GET":
        if pk_item.owner_id != request.user.user_id:
            raise ApplicationError(ErrorCode.UNAUTHENTICATED, ["No permission to edit"])

    collection_import_instances = []

    for collection_import_data in serializer.data["imports"]:
        collection_import_serializer = serializers.CollectionImportCreateSerializer(
            data=collection_import_data)

        collection_import_serializer.is_valid()
        collection_import_serializer.save(
            collection_id=pk_item.id, status=CollectionImport.IN_QUEUE)

        collection_import = collection_import_serializer.instance
        assert isinstance(collection_import, CollectionImport)

        collection_import_instances.append(collection_import)

        file_type = utils.get_extension_from_filename(collection_import.file_key)
        # TODO: add apkg
        if file_type == ".pdf":
            jobs.import_cards_from_pdf.delay(collection_import=collection_import)
        elif file_type == ".jpg" or file_type == ".png":
            jobs.import_card_from_image.delay(collection_import=collection_import)

    response_serializer = serializers.CollectionImportSerializer(
        collection_import_instances, many=True)

    return Response({"items": response_serializer.data})


@api_view(["POST"])
@convert_keys_to_item({"pk": helpers.get_default_collection_queryset_by_request})
@validate_request_data(card_serializers.CollectionImportTextRequestSerializer)
def import_text_collection_view(request, pk_item, serializer):
    collection_id = pk_item.id

    # Only can edit own items
    if request.user.is_authenticated and request.method != "GET":
        assert isinstance(pk_item, Collection)
        if pk_item.owner_id != request.user.user_id:
            raise ApplicationError(ErrorCode.UNAUTHENTICATED, ["No permission to edit"])

    card_instances = []

    for card_import_text_data in serializer.data["imports"]:
        card = card_serializers.CollectionImportTextSerializer(
            data=card_import_text_data)
        card.is_valid()

        card.save(collection_id=collection_id,
                  type=Card.TEXT,
                  is_reviewed=True)

        card_instances.append(card.instance)

    response_serializer = card_serializers.CardListSerializer(
        card_instances, many=True)

    return Response({"items": response_serializer.data})


@api_view(["GET"])
@convert_keys_to_item({
    "pk": helpers.get_default_collection_queryset_by_request,
    "pkImport": helpers.get_default_collection_import_queryset_by_request,
})
def get_collection_import_view(request, pk_item, pkImport_item):
    serializer = serializers.CollectionImportSerializer(pkImport_item)
    return Response({"item": serializer.data})


@api_view(["GET"])
@convert_keys_to_item({"pk": helpers.get_default_collection_queryset_by_request})
def list_collection_import_view(request, pk_item):
    return utils.filter_model_by_get_request(
        request,
        helpers.get_default_collection_import_queryset_by_request(
            request).filter(collection_id=pk_item.id),
        serializers.CollectionImportSerializer,
    )


@api_view(["POST"])
@convert_keys_to_item({
    "pk": helpers.get_default_collection_queryset_by_request,
    "pkImport": helpers.get_default_collection_import_queryset_by_request,
})
def review_collection_import_view(request, pk_item, pkImport_item):
    # Only can edit own items
    if request.user.is_authenticated and request.method != "GET":
        if pk_item.owner_id != request.user.user_id:
            raise ApplicationError(ErrorCode.UNAUTHENTICATED, ["No permission to edit"])

    import_cards = Card.objects.filter(collection_import_id=pkImport_item.id)
    for card in import_cards:
        card.is_reviewed = True
        card.save()

    pkImport_item.is_reviewed = True
    pkImport_item.save()

    response_serializer = serializers.CollectionImportSerializer(pkImport_item)

    return Response({"item": response_serializer.data})


@api_view(["POST"])
@convert_keys_to_item({"pk": Collection})
@validate_request_data(serializers.CollectionSerializer)
def duplicate_collection(request, pk_item, serializer):
    newcollection = jobs.duplicate_collection(pk_item, request.user.user_id)
    return Response({"items": newcollection})
