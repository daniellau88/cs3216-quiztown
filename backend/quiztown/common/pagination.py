from rest_framework.pagination import LimitOffsetPagination

DEFAULT_LIMIT = 20


class CustomPagination(LimitOffsetPagination):
    default_limit = DEFAULT_LIMIT
    limit_query_param = "length"
    offset_query_param = "start"
