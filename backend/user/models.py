from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models

from quiztown.common.models import TimestampedModel


class UserManager(BaseUserManager):
    pass


class User(TimestampedModel, AbstractBaseUser):
    user_id = models.BigAutoField(primary_key=True)
    email = models.EmailField(max_length=100, unique=True, null=False)
    name = models.CharField(max_length=100, null=False)
    profile_picture_link = models.CharField(max_length=1024)

    USERNAME_FIELD = "email"
    objects = UserManager()
