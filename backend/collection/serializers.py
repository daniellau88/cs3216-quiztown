from rest_framework import serializers

from card.models import Card

from .models import Collection, CollectionImport, CollectionTag, Tag


class CollectionSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    num_cards = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ["id", "name", "owner_id", "private", "created_at", "image_link",
                  "origin", "tags", "num_cards"]

    def get_tags(self, obj):
        tag_ids = CollectionTag.objects.filter(
            collection_id=obj.id).values_list("tag_id", flat=True)
        tag_ids_set = list(set(tag_ids))
        tags = Tag.objects.filter(id__in=tag_ids_set).values_list("name", flat=True)
        return tags

    def get_num_cards(self, obj):
        card_num = Card.objects.filter(collection_id=obj.id, is_reviewed=True).count()
        return card_num


class CollectionCreateSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Collection
        fields = ["name", "private", "image_link", "tags"]

    def create(self, validated_data):
        tags = validated_data.pop("tags")
        tag_objects = []
        for tag in tags:
            tag_objects.append(Tag.objects.get_or_create(name=tag)[0])

        new_collection = super().create(validated_data)

        for tag_obj in tag_objects:
            CollectionTag.objects.get_or_create(
                collection_id=new_collection.id, tag_id=tag_obj.id)

        return new_collection


class CollectionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["name", "private", "image_link"]


class CollectionImportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImport
        fields = ["id", "collection_id", "file_name",
                  "status", "created_at", "is_reviewed"]


class CollectionImportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImport
        fields = ["file_name", "file_key"]


class CollectionImportRequestSerializer(serializers.Serializer):
    imports = CollectionImportCreateSerializer(many=True)


class CollectionListFilterSerializer(serializers.Serializer):
    private = serializers.IntegerField(required=False)
