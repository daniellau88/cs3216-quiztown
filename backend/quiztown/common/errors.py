from __future__ import annotations

import traceback

from typing import Type

import rest_framework.exceptions as rest_exceptions

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


class ApplicationError(Exception):
    def __init__(self, error_code: int, messages: list[str]):
        self.error_code = error_code
        self.messages = messages


CODE_KEY = "_code"
MESSAGES_KEY = "_messages"

KWARGS_KEY = "kwargs"


def _get_kwargs_from_context(context: dict):
    if KWARGS_KEY not in context or context[KWARGS_KEY] is None:
        # Should not happen
        raise ApplicationError(ErrorCode.INTERNAL_SERVER, ["Internal server error"])
    return context[KWARGS_KEY]


def set_code_on_context(context: dict, code: int):
    _get_kwargs_from_context(context)[CODE_KEY] = code


def get_code_from_context(context: dict) -> int:
    kwargs = _get_kwargs_from_context(context)
    if CODE_KEY not in kwargs:
        return ErrorCode.SUCCESS
    return kwargs[CODE_KEY]


def set_messages_on_context(context: dict, messages: list[str]):
    _get_kwargs_from_context(context)[MESSAGES_KEY] = messages


def get_messages_from_context(context: dict) -> list[str]:
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
    messages = []

    if response is not None:
        exception_class = exc.__class__
        if exception_class in REST_EXCEPTION_MAPPING:
            code = REST_EXCEPTION_MAPPING[exception_class]

        if response.data:
            if isinstance(response.data, dict):
                messages.append(response.data.get("detail"))

    elif exc is not None:
        if isinstance(exc, ApplicationError):
            code = exc.error_code
            messages = exc.messages

    if code == -1:
        code = ErrorCode.INTERNAL_SERVER
        messages = ["Internal server error"]

    set_code_on_context(context, code)
    set_messages_on_context(context, messages)
    return Response({})
