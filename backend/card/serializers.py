from django.conf import settings
from rest_framework import serializers

from .models import Card

STATIC_CARD_URL = settings.STATIC_URL + "cards/"


class CardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        exclude = ["image_metadata"]


class CardListFilterSerializer(serializers.Serializer):
    flagged = serializers.IntegerField(required=False)
    collection_id = serializers.IntegerField(required=False)


class CardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "created_at",
                  "type", "question", "answer"]

    def to_representation(self, data):
        rep = super(CardListSerializer, self).to_representation(data)
        rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        return rep


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "image_metadata", "answer_details",
                  "created_at", "type", "question", "answer"]

    def to_representation(self, data):
        rep = super(CardSerializer, self).to_representation(data)
        rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        return rep


class CardImportImageSerializer(serializers.Serializer):
    file_key = serializers.CharField(max_length=50)
    file_name = serializers.CharField(max_length=100)


class CardImportTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "type", "question", "answer", "collection_id"]
