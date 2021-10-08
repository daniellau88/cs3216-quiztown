from rest_framework import serializers

from .models import Card


class CardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        exclude = ["collection_id"]


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = "__all__"


class CardImportSerializer(serializers.Serializer):
    file_key = serializers.CharField(max_length=50)
    file_name = serializers.CharField(max_length=100)
