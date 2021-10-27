from rest_framework import serializers

from .models import User, UserSettings


class UserSerializer(serializers.ModelSerializer):
    settings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["email", "name", "profile_picture_link", "user_id", "settings"]

    def get_settings(self, obj: User):
        settings = UserSettings.objects.filter(
            user_id=obj.user_id).values_list("settings_key", "settings_value")
        return dict(settings)


class UserSettingsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["settings_key", "settings_value"]
