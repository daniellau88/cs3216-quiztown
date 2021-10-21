from rest_framework import serializers

from .models import PublicActivity


class PublicActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicActivity
        fields = ["id", "message", "type", "is_viewed", "params", "created_at"]


class PublicActivityUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicActivity
        fields = ["is_viewed"]
