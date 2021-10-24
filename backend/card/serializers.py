from django.conf import settings
from rest_framework import serializers

from quiztown.common import serializers as commmon_serializers

from .models import Card

STATIC_CARD_URL = settings.STATIC_URL + "cards/"


class CardListFilterSerializer(serializers.Serializer):
    flagged = serializers.IntegerField(required=False)
    collection_id = serializers.IntegerField(required=False)
    is_reviewed = serializers.IntegerField(required=False)
    collection_import_id = serializers.IntegerField(required=False)
    next_date = commmon_serializers.DateRangeSerializer(required=False)


class CardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "created_at",
                  "type", "question", "answer", "is_reviewed"]

    def to_representation(self, data):
        rep = super(CardListSerializer, self).to_representation(data)
        rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        return rep


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "image_metadata", "answer_details",
                  "created_at", "type", "question", "answer", "is_reviewed"]

    def to_representation(self, data):
        rep = super(CardSerializer, self).to_representation(data)
        rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        return rep


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
