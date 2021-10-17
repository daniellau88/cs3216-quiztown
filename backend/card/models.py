from datetime import date

import numpy

from django.core.serializers.json import DjangoJSONEncoder
from django.db import models

from quiztown.common.models import TimestampedModel


class JSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.float32):
            return float(obj)
        return super().default(obj)


class Card(TimestampedModel):
    FLAGGED = 1
    NOTFLAGED = 0
    FLAG_STATUS = (
        (FLAGGED, "flagged"),
        (NOTFLAGED, "notflagged"),
    )

    name = models.CharField(max_length=100, blank=True)
    collection_id = models.IntegerField()
    flagged = models.PositiveSmallIntegerField(
        choices=FLAG_STATUS, default=NOTFLAGED, blank=True)
    image_file_key = models.CharField(max_length=1024, default="", blank=True)
    image_metadata = models.JSONField(default=dict, encoder=JSONEncoder)
    next_date = models.DateField(default=date.today, blank=True)
    box_number = models.IntegerField(default=0)
    answer_details = models.JSONField(default=dict, encoder=JSONEncoder)

    def create(self, validated_data):
        return Card.objects.create(validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.collection_id = validated_data.get(
            "collection_id", instance.collection_id)
        instance.flagged = validated_data.get("flagged", instance.flagged)
        instance.next_date = validated_data.get("next_date", instance.next_date)
        instance.box_number = validated_data.get("box_number", instance.box_number)
        instance.answer_details = validated_data.get(
            "answer_details", instance.answer_details)
        instance.save()
        return instance
