import datetime

from django.db import models


class TimestampIntegerField(models.BigIntegerField):
    description = "Timestamp field stored as integer"

    def get_internal_type(self):
        return "IntegerField"

    def from_db_value(self, value, expression, connection):
        return datetime.datetime.fromtimestamp(value)

    def to_python(self, value):
        if value is None:
            return value
        if isinstance(value, datetime.datetime) or value is None:
            return value
        return datetime.datetime.fromisoformat(value)

    # Convert python to db
    def get_prep_value(self, value):
        if value is None:
            return 0
        return value.timestamp()


class TimestampedModel(models.Model):
    created_at = TimestampIntegerField()
    updated_at = TimestampIntegerField()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self._state.adding:
            self.created_at = datetime.datetime.now()
        self.updated_at = datetime.datetime.now()
        super().save(*args, **kwargs)
