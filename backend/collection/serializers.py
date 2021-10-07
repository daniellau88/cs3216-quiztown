from rest_framework import serializers

from .models import Collection, CollectionImport


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "name", "owner_id", "private", "created_at", "image_link"]


class CollectionImportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImport
        fields = ["file_name", "file_key"]


class CollectionImportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImport
        fields = ["id", "collection_id", "file_name", "status", "created_at"]
