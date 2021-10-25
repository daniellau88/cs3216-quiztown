import datetime

from django.db import models

from .middlewares import get_request


def get_default_current_timestamp():
    return datetime.datetime.now().timestamp()


class TimestampedModel(models.Model):
    created_at = models.BigIntegerField(default=get_default_current_timestamp)
    updated_at = models.BigIntegerField(default=get_default_current_timestamp)
    created_by = models.IntegerField()
    updated_by = models.IntegerField()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        user_id = 0
        request = get_request()
        if request:
            user = request.user
            if user and user.is_authenticated:
                user_id = user.pk

        if self._state.adding:
            self.created_at = get_default_current_timestamp()
            self.created_by = user_id
        self.updated_at = get_default_current_timestamp()
        self.updated_by = user_id
        super().save(*args, **kwargs)
