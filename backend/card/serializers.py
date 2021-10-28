from django.conf import settings
from rest_framework import serializers

from collection import helpers as collection_helpers
from collection.models import Collection
from quiztown.common import serializers as commmon_serializers

from .models import Card

STATIC_CARD_URL = settings.STATIC_URL + "cards/"


class CardListFilterSerializer(serializers.Serializer):
    flagged = serializers.IntegerField(required=False)
    collection_id = serializers.IntegerField(required=False)
    is_reviewed = serializers.IntegerField(required=False)
    collection_import_id = serializers.IntegerField(required=False)
    next_date = commmon_serializers.DateRangeSerializer(required=False)
    owner_id = serializers.IntegerField(required=False)

    def get_owner_id_filter(self, value):
        return ("collection_id__in", Collection.objects.filter(owner_id=value).values_list("id", flat=True))


class CardListSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "created_at", "type", "question",
                  "answer", "is_reviewed", "permissions"]

    def to_representation(self, data):
        rep = super(CardListSerializer, self).to_representation(data)
        if rep["image_file_key"]:
            rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        else:
            rep["image_link"] = ""
        del rep["image_file_key"]
        return rep

    def get_permissions(self, obj):
        collection = list(collection_helpers.get_editable_collection_queryset_by_request(
            self.context["request"]).filter(id=obj.collection_id))
        has_permission = len(collection) > 0
        return {
            "can_update": has_permission,
            "can_delete": has_permission,
        }


class CardSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "image_metadata", "answer_details",
                  "created_at", "type", "question", "answer", "is_reviewed",
                  "permissions"]

    def to_representation(self, data):
        rep = super(CardSerializer, self).to_representation(data)
        if rep["image_file_key"]:
            rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        else:
            rep["image_link"] = ""
        del rep["image_file_key"]
        return rep

    def get_permissions(self, obj):
        collection = list(collection_helpers.get_editable_collection_queryset_by_request(
            self.context["request"]).filter(id=obj.collection_id))
        has_permission = len(collection) > 0
        return {
            "can_update": has_permission,
            "can_delete": has_permission,
        }


class CardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "image_metadata", "answer_details",
                  "type", "question", "answer"]


class CardUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["name", "flagged", "next_date", "box_number",
                  "answer_details", "question", "answer", "is_reviewed"]


class CollectionImportTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["name", "question", "answer"]


class CollectionImportTextRequestSerializer(serializers.Serializer):
    imports = CollectionImportTextSerializer(many=True)
