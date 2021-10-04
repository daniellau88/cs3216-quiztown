from django.db import models

from quiztown.common.models import TimestampedModel


class AuthenticationBase(TimestampedModel):
    user_id = models.IntegerField(null=False, unique=True)
    email = models.CharField(max_length=100, null=False)

    class Meta:
        abstract = True


class GoogleAuthentication(AuthenticationBase):
    sub = models.CharField(max_length=255, null=False, unique=True)
