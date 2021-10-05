from datetime import date

from django.db import models

from quiztown.common.models import TimestampedModel


class Card(TimestampedModel):
    FLAGGED = 1
    NOTFLAGED = 0
    FLAG_STATUS = (
        (FLAGGED, "flagged"),
        (NOTFLAGED, "notflagged"),
    )

    name = models.CharField(max_length=30)
    collection_id = models.IntegerField()
    flagged = models.PositiveSmallIntegerField(
        choices=FLAG_STATUS, default="notflagged", blank=True)
    image_link = models.CharField(max_length=1024, default="", blank=True)
    next_date = models.DateField(default=date.today, blank=True)

    def create(self, validated_data):
        return Card.objects.create(validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.collection_id = validated_data.get(
            "collection_id", instance.collection_id)
        instance.flagged = validated_data.get("flagged", instance.flagged)
        instance.next_date = validated_data.get("next_date", instance.next_date)
        instance.save()
        return instance
