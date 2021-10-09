from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

DEFAULT_LIMIT = 20


class CustomPagination(LimitOffsetPagination):
    default_limit = DEFAULT_LIMIT
    limit_query_param = "length"
    offset_query_param = "start"

    def get_paginated_response(self, data):
        response = {"total_count": self.count}
        response.update(data)
        return Response(response)
