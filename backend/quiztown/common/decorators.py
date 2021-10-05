from quiztown.common.errors import ApplicationError, ErrorCode


def validate_request_data(serializer_class):
    def validate_request_data_decorator(view):
        def wrapper_validate_request_data(request, *args, **kwargs):
            serializer = serializer_class(data=request.data)

            if serializer.is_valid():
                return view(request, serializer, *args, **kwargs)

            error_messages = [key + ": " + ", ".join(serializer.errors[key])
                              for key in serializer.errors.keys()]

            raise ApplicationError(ErrorCode.INVALID_REQUEST, error_messages)
        return wrapper_validate_request_data
    return validate_request_data_decorator
