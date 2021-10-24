from __future__ import annotations

import os.path
import typing

from collections import OrderedDict
from dataclasses import asdict

import django.http
import rest_framework.request

from django.db.models import Q
from django.db.models.query import QuerySet
from rest_framework import serializers

from quiztown.common.middlewares import get_request

from .errors import ApplicationError, ErrorCode, Message
from .pagination import CustomPagination
from .serializers import ListRequestSerializer


def generate_response(code: int, messages: list[Message], payload: dict):
    request = get_request()

    return {
        "code": code,
        "messages": [asdict(message) for message in messages],
        "payload": payload,
        "metadata": {
            "is_authenticated": request.user.is_authenticated,
        },
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


def _flatten_dict(dictionary: dict, result: dict = {}, prefix: str = ""):
    for key, value in dictionary.items():
        new_key = prefix + "." + key if prefix != "" else key
        if isinstance(value, dict):
            _flatten_dict(value, result, new_key)
        else:
            result[new_key] = value
    return result


def get_error_messages_from_serializer(serializer: serializers.Serializer) -> list[str]:
    flatten_errors = _flatten_dict(serializer.errors)
    error_messages = [key + ": " + ", ".join(flatten_errors[key])
                      for key in flatten_errors.keys()]
    return error_messages


def _add_filter_to_queryset(queryset: QuerySet, key: str, value) -> QuerySet:
    filter = {}
    filter[key] = value
    return queryset.filter(**filter)


def filter_model_by_get_request(
        request: rest_framework.request.Request,
        model_queryset: QuerySet,
        model_serializer_class: typing.Type[serializers.Serializer],
        filter_serializer_class: typing.Type[serializers.Serializer] | None = None,
        search_fields: list[str] = []):
    get_request = convert_get_request_to_dict(request.GET)
    get_serializer = ListRequestSerializer(data=get_request)

    if not get_serializer.is_valid():
        raise ApplicationError(ErrorCode.INVALID_REQUEST,
                               get_error_messages_from_serializer(get_serializer))

    filters = get_serializer.data.get("filters", {})
    if filter_serializer_class and filters:
        filter_serializer = filter_serializer_class(data=filters)
        if not filter_serializer.is_valid():
            raise ApplicationError(ErrorCode.INVALID_REQUEST,
                                   get_error_messages_from_serializer(filter_serializer))

        for field, value in filter_serializer.data.items():
            if isinstance(value, OrderedDict):
                start = value.get("start", "")
                if start:
                    model_queryset = _add_filter_to_queryset(
                        model_queryset, field + "__gte", start)
                end = value.get("end", "")
                if end:
                    model_queryset = _add_filter_to_queryset(
                        model_queryset, field + "__lte", end)
            else:
                model_queryset = _add_filter_to_queryset(model_queryset, field, value)

    search = get_serializer.data.get("search", "")
    if search and search_fields:
        search_or_filter = None
        for field in search_fields:
            filter = {}
            # Filter by <field_name>__contains (in DB will filter by '%<string_given>%')
            filter[field + "__contains"] = search
            if search_or_filter is None:
                search_or_filter = Q(**filter)
            else:
                search_or_filter = search_or_filter | Q(**filter)
        model_queryset = model_queryset.filter(search_or_filter)

    sort_by = get_serializer.data.get("sort_by", "")
    order = get_serializer.data.get("order", "")
    if sort_by and order:
        sort_field_name = "-" + sort_by if order == "desc" else sort_by
        model_queryset = model_queryset.order_by(sort_field_name)

    paginator = CustomPagination()
    page = paginator.paginate_queryset(model_queryset, request)

    response_serializer = model_serializer_class(page, many=True)
    return paginator.get_paginated_response({"items": response_serializer.data})


def get_extension_from_filename(filename: str):
    extension = os.path.splitext(filename)[1]
    return extension.lower()
