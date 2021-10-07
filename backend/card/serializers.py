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
