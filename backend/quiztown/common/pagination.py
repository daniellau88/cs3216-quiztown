from rest_framework.pagination import LimitOffsetPagination
# from rest_framework.response import Response


DEFAULT_LIMIT = 20
DEFAULT_PAGE_SIZE = 5


class CustomPagination(LimitOffsetPagination):
    default_limit = DEFAULT_LIMIT
    limit_query_param = "length"
    offset_query_param = "start"
