import requests

from django.contrib.auth import authenticate, login, logout
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from quiztown.common.decorators import validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode
from user import serializers as user_serializers
from user.models import User, UserSettings

from . import serializers
from .models import GoogleAuthentication


@api_view(["GET"])
def test_view(request):
    return Response({"ping": "pong"})


@api_view(["POST"])
@permission_classes([AllowAny])
@validate_request_data(serializers.LoginRequestSerializer)
def login_view(request, serializer, *args, **kwargs):
    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = user_serializers.UserSerializer(user)
        return Response({"item": serializer.data})

    raise ApplicationError(ErrorCode.UNAUTHENTICATED, [
                           "Incorrect username or password"])


@swagger_auto_schema(
    method="POST",
    request_body=serializers.GoogleLoginRequestSerializer,
)
@api_view(["POST"])
@permission_classes([AllowAny])
@validate_request_data(serializers.GoogleLoginRequestSerializer)
def google_login_view(request, serializer):
    token_id = serializer.validated_data["token_id"]

    params = {"id_token": token_id}

    response = requests.get(
        url="https://oauth2.googleapis.com/tokeninfo",
        params=params,
    )

    data = response.json()
    if response.status_code != 200:
        error = data.get("error")
        error_description = data.get("error_description")

        error_message = ""
        if error and error_description:
            error_message = error + ": " + error_description
        else:
            error_message = "Unable to connect to Google Auth"
        raise ApplicationError(ErrorCode.DEPENDENCY_ERROR, [error_message])

    sub = data.get("sub")
    email = data.get("email")
    name = data.get("name")
    profile_picture = data.get("picture")

    user = authenticate(request, google_sub=sub)
    if user is not None:
        login(request, user)
        serializer = user_serializers.UserSerializer(user)
        return Response({"item": serializer.data})

    # User does not exist
    new_user = User(email=email, name=name, profile_picture_link=profile_picture)
    new_user.save()
    auth = GoogleAuthentication(user_id=new_user.user_id, email=email, sub=sub)
    auth.save()

    user = authenticate(request, google_sub=sub)
    if user is not None:
        login(request, user)
        serializer = user_serializers.UserSerializer(user)
        return Response({"item": serializer.data})

    raise ApplicationError(ErrorCode.UNAUTHENTICATED, [
                           "Failed to login"])


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return Response({})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_view(request, *args, **kwargs):
    user = request.user
    serializer = user_serializers.UserSerializer(user)
    return Response({"item": serializer.data})


@swagger_auto_schema(
    method="POST",
    request_body=user_serializers.UserSettingsCreateSerializer,
)
@api_view(["POST"])
@validate_request_data(user_serializers.UserSettingsCreateSerializer, partial=True)
def update_user_settings_view(request, serializer):
    UserSettings.objects.update_or_create(
        user_id=request.user.user_id,
        settings_key=serializer.validated_data["settings_key"],
        defaults=serializer.validated_data,
    )

    settings = UserSettings.objects.filter(
        user_id=request.user.user_id).values_list("settings_key", "settings_value")
    return Response({"item": dict(settings)})
