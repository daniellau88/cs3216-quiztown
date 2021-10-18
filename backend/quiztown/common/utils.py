from __future__ import annotations

import os.path
import typing

from dataclasses import asdict

import django.http
import rest_framework.request

from django.db import models
from rest_framework import serializers

from .errors import ApplicationError, ErrorCode, Message
from .pagination import CustomPagination
from .serializers import ListRequestSerializer


def generate_response(code: int, messages: list[Message], payload: dict):
    return {
        "code": code,
        "messages": [asdict(message) for message in messages],
        "payload": payload,
    }


def _parse_float(value: str) -> (float | None):
    try:
        return float(value)
    except ValueError:
        return None


def _parse_int(value: str) -> (int | None):
    try:
        return int(value)
    except ValueError:
        return None


def _parse_value_from_string(value: str) -> int | float | str:
    # Int should take precedence first
    int_value = _parse_int(value)
    if int_value is not None:
        return int_value

    float_value = _parse_float(value)
    if float_value is not None:
        return float_value

    return value


def convert_get_request_to_dict(get_request: django.http.request.QueryDict) -> dict:
    object = dict()

    for key in get_request.keys():
        field_names = [field_name[:-1] if field_name[-1] == "]"
                       else field_name for field_name in key.split("[")]

        current_dict = object
        for i in range(len(field_names) - 1):
            field_name = field_names[i]

            if field_name not in current_dict:
                # If next element is an array
                if field_names[i + 1] == "":
                    current_dict[field_name] = []
                else:
                    current_dict[field_name] = dict()
            current_dict = current_dict[field_name]

        last_field_name = field_names[-1]

        # If is array
        if last_field_name == "" and isinstance(current_dict, list):
            parsed_values = [_parse_value_from_string(
                value) for value in get_request.getlist(key)]
            current_dict.extend(parsed_values)
        elif isinstance(current_dict, dict):
            value = get_request.get(key)
            assert value is not None
            parsed_value = _parse_value_from_string(value)
            current_dict[last_field_name] = parsed_value

    return object


def get_error_messages_from_serializer(serializer: serializers.Serializer) -> list[str]:
    error_messages = [key + ": " + ", ".join(serializer.errors[key])
                      for key in serializer.errors.keys()]
    return error_messages


def filter_model_by_get_request(
        request: rest_framework.request.Request,
        model_class: typing.Type[models.Model],
        model_serializer_class: typing.Type[serializers.Serializer],
        filter_serializer_class: typing.Type[serializers.Serializer] | None = None):
    get_request = convert_get_request_to_dict(request.GET)
    get_serializer = ListRequestSerializer(data=get_request)

    if not get_serializer.is_valid():
        raise ApplicationError(ErrorCode.INVALID_REQUEST,
                               get_error_messages_from_serializer(get_serializer))

    model_query = model_class.objects.all()

    filters = get_serializer.data.get("filters", {})
    if filter_serializer_class and filters:
        filter_serializer = filter_serializer_class(data=filters)

        if not filter_serializer.is_valid():
            raise ApplicationError(ErrorCode.INVALID_REQUEST,
                                   get_error_messages_from_serializer(filter_serializer))

        for field, value in filter_serializer.data.items():
            filter = {}
            filter[field] = value
            # TODO: handle date range
            model_query = model_query.filter(**filter)

    sort_by = get_serializer.data.get("sort_by", "")
    order = get_serializer.data.get("order", "")
    if sort_by and order:
        sort_field_name = "-" + sort_by if order == "desc" else sort_by
        model_query = model_query.order_by(sort_field_name)

    paginator = CustomPagination()
    page = paginator.paginate_queryset(model_query, request)

    response_serializer = model_serializer_class(page, many=True)
    return paginator.get_paginated_response({"items": response_serializer.data})


def get_extension_from_filename(filename: str):
    extension = os.path.splitext(filename)[1]
    return extension.lower()
