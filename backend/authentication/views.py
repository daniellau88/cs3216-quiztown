from rest_framework.decorators import api_view
from rest_framework.response import Response

from quiztown.common.decorators import validate_request_data
from quiztown.common.errors import ApplicationError, ErrorCode

from . import manager
from .serializers import LoginRequestSerializer


@api_view(["GET"])
def test_view(request):
    return Response({"ping": "pong"})


@api_view(["POST"])
@validate_request_data(LoginRequestSerializer)
def login_view(request, data):
    username = data["username"]
    password = data["password"]

    user = manager.get_user_by_username_and_password(username, password)
    if user is None:
        raise ApplicationError(ErrorCode.NO_PERMISSION, ["Incorrect credentials"])

    return Response({})
