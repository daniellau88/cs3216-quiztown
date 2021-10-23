from django.db import models

from quiztown.common.models import TimestampedModel


class Collection(TimestampedModel):
    PRIVATE = 0
    PUBLIC = 1

    name = models.CharField(max_length=30)
    owner_id = models.IntegerField()
    private = models.IntegerField(default=PRIVATE)
    image_link = models.CharField(max_length=1024, default="")
    origin = models.IntegerField(default=0, blank=True)

    def create(self, validated_data):
        return Collection.objects.create(validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.owner_id = validated_data.get("owner_id", instance.owner_id)
        instance.private = validated_data.get("private", instance.private)
        instance.origin = validated_data.get("origin", instance.origin)
        instance.save()
        return instance


class CollectionImport(TimestampedModel):
    UNKNOWN = 0
    IN_QUEUE = 1
    IN_PROGRESS = 2
    COMPLETED = 3
    ERROR = 4
    IMPORT_STATUS = (
        (UNKNOWN, "Unknown"),
        (IN_QUEUE, "In Queue"),
        (IN_PROGRESS, "In Progress"),
        (COMPLETED, "Completed"),
        (ERROR, "Error"),
    )

    collection_id = models.IntegerField()
    status = models.PositiveIntegerField(choices=IMPORT_STATUS)
    file_key = models.CharField(max_length=50, null=False)
    file_name = models.CharField(max_length=100, null=False)
    is_reviewed = models.BooleanField(null=False, default=False)

    def create(self, validated_data):
        return CollectionImport.objects.create(validated_data)

    def update(self, instance, validated_data):
        instance.status = validated_data.get("status", instance.status)
        instance.save()
        return instance


class Tag(TimestampedModel):
    name = models.CharField(max_length=100, unique=True)

    def create(self, validated_data):
        return Tag.objects.create(validated_data)


class CollectionTag(TimestampedModel):
    collection_id = models.IntegerField()
    tag_id = models.IntegerField()

    def create(self, validated_data):
        return CollectionTag.objects.create(validated_data)
