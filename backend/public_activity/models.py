from django.db import models

from quiztown.common.models import TimestampedModel


class PublicActivity(TimestampedModel):
    UNKNOWN = 0
    COLLECTION_IMPORT = 1
    PUBLIC_ACTIVITY_TYPES = (
        (UNKNOWN, "Unknown"),
        (COLLECTION_IMPORT, "CollectionImport"),
    )

    message = models.CharField(max_length=150)
    type = models.PositiveIntegerField(choices=PUBLIC_ACTIVITY_TYPES)
    is_viewed = models.BooleanField(default=False)
    params = models.JSONField(default=dict)
    user_id = models.IntegerField()
