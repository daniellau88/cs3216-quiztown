from django.conf import settings
from rest_framework import serializers

from .models import Card

STATIC_CARD_URL = settings.STATIC_URL + "cards/"


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
                  "answer_details", "question", "answer"]


class CardImportImageSerializer(serializers.Serializer):
    file_key = serializers.CharField(max_length=50)
    file_name = serializers.CharField(max_length=100)


class CardImportTextSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=1000)
    answer = serializers.CharField(max_length=1000)
