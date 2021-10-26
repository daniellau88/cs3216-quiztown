from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from quiztown.common.models import TimestampedModel


class UserManager(BaseUserManager):
    pass


class User(TimestampedModel, AbstractBaseUser, PermissionsMixin):
    user_id = models.BigAutoField(primary_key=True)
    email = models.EmailField(max_length=100, unique=True, null=False)
    name = models.CharField(max_length=100, null=False)
    profile_picture_link = models.CharField(max_length=1024)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    objects = UserManager()


class UserSettings(TimestampedModel):
    user_id = models.IntegerField()
    settings_key = models.CharField(max_length=50, null=False)
    settings_value = models.PositiveIntegerField(default=0, null=False)

    def create(self, validated_data):
        return UserSettings.objects.create(validated_data)

    def update(self, instance, validated_data):
        instance.settings_value = validated_data.get("settings_value",
                                                     instance.settings_value)
        instance.save()
        return instance
