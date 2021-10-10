from django.conf import settings
from rest_framework import serializers

from .models import Card

STATIC_CARD_URL = settings.STATIC_URL + "cards/"


class CardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        exclude = ["collection_id", "image_metadata"]


class CardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "created_at"]

    def to_representation(self, data):
        rep = super(CardListSerializer, self).to_representation(data)
        rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        return rep


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "collection_id", "flagged", "image_file_key",
                  "next_date", "box_number", "image_metadata", "answer_details", "created_at"]

    def to_representation(self, data):
        rep = super(CardSerializer, self).to_representation(data)
        rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        return rep


class CardImportSerializer(serializers.Serializer):
    file_key = serializers.CharField(max_length=50)
    file_name = serializers.CharField(max_length=100)
