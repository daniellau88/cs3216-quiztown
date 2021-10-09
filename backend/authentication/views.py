import requests

from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response

from quiztown.common.decorators import validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode
from user.models import User
from user.serializers import UserSerializer

from . import serializers
from .models import GoogleAuthentication


@api_view(["GET"])
def test_view(request):
    return Response({"ping": "pong"})


@api_view(["POST"])
@validate_request_data(serializers.LoginRequestSerializer)
def login_view(request, serializer, *args, **kwargs):
    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({"item": serializer.data})

    raise ApplicationError(ErrorCode.UNAUTHENTICATED, [
                           "Incorrect username or password"])


@api_view(["POST"])
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
        serializer = UserSerializer(user)
        return Response({"item": serializer.data})

    # User does not exist
    new_user = User(email=email, name=name, profile_picture_link=profile_picture)
    new_user.save()
    auth = GoogleAuthentication(user_id=new_user.user_id, email=email, sub=sub)
    auth.save()

    user = authenticate(request, google_sub=sub)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({"item": serializer.data})

    raise ApplicationError(ErrorCode.UNAUTHENTICATED, [
                           "Failed to login"])
