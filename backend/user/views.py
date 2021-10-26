from rest_framework.decorators import api_view
from rest_framework.response import Response

from quiztown.common.decorators import validate_request_data
from user.models import UserSettings

from . import serializers


@api_view(["GET", "POST"])
def list_or_add_user_settings_view(request, *args, **kwargs):
    if request.method == "GET":
        return list_user_settings_view(request, *args, **kwargs)
    elif request.method == "POST":
        return add_user_settings_view(request, *args, **kwargs)


def list_user_settings_view(request, serializer):
    settings = UserSettings.objects.filter(user_id=request.user.user_id)
    serializer = serializers.UserSettingsSerializer(settings, many=True)
    return Response({"items": serializer.data})


@validate_request_data(serializers.UserSettingsRequestSerializer)
def add_user_settings_view(request, serializer):
    user_setting_instances = []

    for user_setting_data in serializer.data["settings"]:
        settings = UserSettings.objects.filter(
            user_id=request.user.user_id,
            settings_key=user_setting_data.settings_key)
        if settings:
            updateSerializer = serializers.UserSettingsUpdateSerializer(
                settings,
                data=user_setting_data)
            if updateSerializer.is_valid():
                updateSerializer.save()
                user_setting_instances.append(updateSerializer.data)
        else:
            user_settings_serializer = serializers.UserSettingsCreateSerializer(
                data=user_setting_data)

            user_settings_serializer.is_valid()
            user_settings_serializer.save(user_id=request.user.user_id)

            user_setting = user_settings_serializer.instance
            assert isinstance(user_setting, UserSettings)

            user_setting_instances.append(user_setting)

    response_serializer = serializers.UserSettingsSerializer(
        user_setting_instances, many=True)

    return Response({"items": response_serializer.data})
