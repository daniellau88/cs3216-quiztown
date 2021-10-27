from rest_framework import serializers

from .models import User, UserSettings


class UserSerializer(serializers.ModelSerializer):
    settings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["email", "name", "profile_picture_link", "user_id", "settings"]

    def get_settings(self, obj):
        settings = UserSettings.objects.filter(
            user_id=obj.id)
        return settings


class UserSettingsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["settings_key", "settings_value"]


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["id", "user_id", "settings_key",
                  "settings_value", "created_at"]


class UserSettingsRequestSerializer(serializers.Serializer):
    imports = UserSettingsCreateSerializer(many=True)


class UserSettingsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["settings_value"]
