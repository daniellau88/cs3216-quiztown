from __future__ import annotations

import traceback

from dataclasses import dataclass
from typing import Type, Union

import redis.exceptions
import rest_framework.exceptions as rest_exceptions

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import exception_handler as rest_exception_handler


class ErrorCode:
    SUCCESS = 0

    METHOD_NOT_ALLOWED = 1
    UNAUTHENTICATED = 2
    NO_PERMISSION = 3
    INVALID_REQUEST = 4
    NOT_FOUND = 5

    INTERNAL_SERVER = 200
    DEPENDENCY_ERROR = 201


def is_user_error(error_code: int):
    return error_code != 0 and error_code // 100 == 0


def is_internal_server_error(error_code: int):
    return error_code // 100 == 2


class ApplicationError(Exception):
    def __init__(self, error_code: int, messages: list[str]):
        self.error_code = error_code
        self.messages = messages


ContextType = Union[Request, dict]
REQUEST_INTERNAL_ATTR = "_internal"
CODE_KEY = "_code"
MESSAGES_KEY = "_messages"


class MessageType:
    ERROR = 1
    WARNING = 2
    INFORMATION = 3
    SUCCESS = 4


@dataclass
class Message:
    content: str
    type: int


def _get_kwargs_from_context(context: ContextType):
    if isinstance(context, dict):
        context = context["request"]

    assert isinstance(context, Request)

    if not hasattr(context, REQUEST_INTERNAL_ATTR):
        setattr(context, REQUEST_INTERNAL_ATTR, dict())
    return getattr(context, REQUEST_INTERNAL_ATTR)


def set_code_on_context(context: ContextType, code: int):
    _get_kwargs_from_context(context)[CODE_KEY] = code


def get_code_from_context(context: ContextType) -> int:
    kwargs = _get_kwargs_from_context(context)
    if CODE_KEY not in kwargs:
        return ErrorCode.SUCCESS
    return kwargs[CODE_KEY]


def add_message_on_context(
        context: ContextType,
        message_content: str,
        message_type: int = MessageType.SUCCESS):
    kwargs = _get_kwargs_from_context(context)
    if MESSAGES_KEY not in kwargs:
        kwargs[MESSAGES_KEY] = []

    messages = kwargs[MESSAGES_KEY]
    messages.append((Message(message_content, message_type)))


def get_messages_from_context(context: ContextType) -> list[Message]:
    kwargs = _get_kwargs_from_context(context)
    if MESSAGES_KEY not in kwargs:
        return []
    return kwargs[MESSAGES_KEY]


REST_EXCEPTION_MAPPING: dict[Type[Exception], int] = {
    rest_exceptions.MethodNotAllowed: ErrorCode.METHOD_NOT_ALLOWED,
    rest_exceptions.ParseError: ErrorCode.INVALID_REQUEST,
    rest_exceptions.AuthenticationFailed: ErrorCode.UNAUTHENTICATED,
    rest_exceptions.NotAuthenticated: ErrorCode.UNAUTHENTICATED,
    rest_exceptions.PermissionDenied: ErrorCode.NO_PERMISSION,
    rest_exceptions.NotFound: ErrorCode.NOT_FOUND,
}


def exception_handler(exc: Exception, context):
    # Call REST framework"s default exception handler first,
    # to get the standard error response.
    response = rest_exception_handler(exc, context)

    print(exc)
    traceback.print_exc()

    code = -1

    if response is not None:
        exception_class = exc.__class__
        if exception_class in REST_EXCEPTION_MAPPING:
            code = REST_EXCEPTION_MAPPING[exception_class]

        if response.data:
            if isinstance(response.data, dict):
                add_message_on_context(context, response.data.get(
                    "detail", ""), MessageType.ERROR)

    elif exc is not None:
        if isinstance(exc, ApplicationError):
            code = exc.error_code
            for message in exc.messages:
                add_message_on_context(context, message, MessageType.ERROR)
        if isinstance(exc, redis.exceptions.ConnectionError):
            code = ErrorCode.DEPENDENCY_ERROR
            add_message_on_context(context, "Connection Error", MessageType.ERROR)

    if code == -1:
        code = ErrorCode.INTERNAL_SERVER
        add_message_on_context(context, "Internal Server Error", MessageType.ERROR)

    set_code_on_context(context, code)

    http_status = status.HTTP_500_INTERNAL_SERVER_ERROR
    if is_user_error(code):
        http_status = status.HTTP_400_BAD_REQUEST

    return Response({}, status=http_status)
