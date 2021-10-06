from __future__ import annotations

import typing

from django.db import models
from rest_framework import serializers

from quiztown.common.errors import ApplicationError, ErrorCode

ITEM_SUFFIX = "_item"


# Automatically converts all keys to object
# e.g. pk will be converted to pk_item (based on ITEM_SUFFIX)
def convert_keys_to_item(model_classes: dict[str, typing.Type[models.Model]]):
    def convert_keys_to_item_decorator(view):
        def wrapper_convert_keys_to_item_decorator(request, *args, **kwargs):
            kwargs_keys = list(kwargs.keys())
            for kwargs_key in kwargs_keys:
                if kwargs_key not in model_classes:
                    continue
                model_class = model_classes[kwargs_key]

                try:
                    pk = kwargs[kwargs_key]
                    item = model_class.objects.get(id=pk)

                    kwargs.pop(kwargs_key)
                    new_key_name = kwargs_key + ITEM_SUFFIX
                    kwargs[new_key_name] = item
                except model_class.DoesNotExist:
                    raise ApplicationError(ErrorCode.NOT_FOUND, [
                                           model_class.__name__ + " not found"])

            return view(request, *args, **kwargs)
        return wrapper_convert_keys_to_item_decorator
    return convert_keys_to_item_decorator


# Validates the request data
# If it is an update, will need the initial instance of the object to update properly
def validate_request_data(
        serializer_class: typing.Type[serializers.Serializer],
        item_key: str = "pk_item",
        is_update: bool = False):
    def validate_request_data_decorator(view):
        def wrapper_validate_request_data(request, *args, **kwargs):
            serializer = None

            if is_update:
                if item_key not in kwargs:
                    raise ApplicationError(ErrorCode.INTERNAL_SERVER, [
                                           "Internal server error"])

                item = kwargs[item_key]
                serializer = serializer_class(item, data=request.data, partial=True)
            else:
                serializer = serializer_class(data=request.data)

            if serializer.is_valid():
                return view(request, serializer=serializer, *args, **kwargs)

            error_messages = [key + ": " + ", ".join(serializer.errors[key])
                              for key in serializer.errors.keys()]

            raise ApplicationError(ErrorCode.INVALID_REQUEST, error_messages)
        return wrapper_validate_request_data
    return validate_request_data_decorator
