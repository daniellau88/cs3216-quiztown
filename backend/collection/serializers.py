from rest_framework import serializers

from card.models import Card
from card.serializers import STATIC_CARD_URL

from . import helpers
from .models import Collection, CollectionImport, CollectionTag, Tag


class CollectionSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    num_cards = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    duplicate_collection_id = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ["id", "name", "owner_id", "private", "created_at", "image_file_key",
                  "origin", "tags", "num_cards", "permissions",
                  "duplicate_collection_id"]

    def get_tags(self, obj):
        tag_ids = CollectionTag.objects.filter(
            collection_id=obj.id).values_list("tag_id", flat=True)
        tag_ids_set = list(set(tag_ids))
        tags = Tag.objects.filter(id__in=tag_ids_set).values_list("name", flat=True)
        return tags

    def get_num_cards(self, obj):
        card_num = Card.objects.filter(collection_id=obj.id, is_reviewed=True).count()
        return card_num

    def get_permissions(self, obj):
        collection = list(helpers.get_editable_collection_queryset_by_request(
            self.context["request"]).filter(id=obj.id))
        has_permission = len(collection) > 0
        return {
            "can_update": has_permission,
            "can_delete": has_permission,
            "can_create_card": has_permission,
        }

    def get_duplicate_collection_id(self, obj):
        collection = list(helpers.get_editable_collection_queryset_by_request(
            self.context["request"]).filter(origin=obj.id))
        if len(collection) > 0:
            return collection[0].pk
        return 0

    def to_representation(self, data):
        rep = super().to_representation(data)
        if rep["image_file_key"]:
            rep["image_link"] = STATIC_CARD_URL + rep["image_file_key"]
        else:
            rep["image_link"] = ""
        del rep["image_file_key"]
        return rep


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
    tags = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Collection
        fields = ["name", "private", "image_link", "tags"]

    def update(self, instance, validated_data):
        if "tags" in validated_data:
            tags = validated_data.pop("tags")
            new_tag_ids = set()
            for tag in tags:
                tag_object = Tag.objects.get_or_create(name=tag)[0]
                new_tag_ids.add(tag_object.id)

            old_collection_tag = CollectionTag.objects.filter(collection_id=instance.id)
            old_tag_ids = set(
                [collection_tag.tag_id for collection_tag in old_collection_tag])

            to_add_tag_ids = new_tag_ids - old_tag_ids
            for tag_id in to_add_tag_ids:
                CollectionTag.objects.get_or_create(
                    collection_id=instance.id, tag_id=tag_id)

            to_remove_tag_ids = old_tag_ids - new_tag_ids
            if len(to_remove_tag_ids) > 0:
                CollectionTag.objects.filter(
                    collection_id=instance.id, tag_id__in=to_remove_tag_ids).delete()

        return super().update(instance, validated_data)


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
    owner_id = serializers.IntegerField(required=False)
    tags = serializers.ListField(required=False, child=serializers.IntegerField())

    def get_tags_filter(self, value):
        collection_ids = CollectionTag.objects.filter(
            tag_id__in=value).values_list("collection_id", flat=True)
        return ("id__in", collection_ids)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]
