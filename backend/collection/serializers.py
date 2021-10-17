from rest_framework import serializers

from card.models import Card

from .models import Collection, CollectionImport


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "name", "owner_id", "private", "created_at", "image_link"]


class CollectionImportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImport
        fields = ["file_name", "file_key"]


class CollectionImportRequestSerializer(serializers.Serializer):
    imports = CollectionImportCreateSerializer(many=True)


class CollectionImportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImport
        fields = ["id", "collection_id", "file_name",
                  "status", "created_at", "is_reviewed"]


class CollectionTextImportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["question", "answer"]


class CollectionTextImportRequestSerializer(serializers.Serializer):
    imports = CollectionTextImportCreateSerializer(many=True)


class CollectionTextImportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "collection_id", "question",
                  "answer", "created_at"]
