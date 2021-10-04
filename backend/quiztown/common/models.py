import datetime

from django.db import models


def get_default_current_timestamp():
    return datetime.datetime.now().timestamp()


class TimestampedModel(models.Model):
    created_at = models.BigIntegerField(default=get_default_current_timestamp)
    updated_at = models.BigIntegerField(default=get_default_current_timestamp)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self._state.adding:
            self.created_at = get_default_current_timestamp()
        self.updated_at = get_default_current_timestamp()
        super().save(*args, **kwargs)
