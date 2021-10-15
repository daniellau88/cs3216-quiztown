from rest_framework.decorators import api_view
from rest_framework.response import Response

from public_activity import serializers
from quiztown.common.pagination import CustomPagination

from .models import PublicActivity


@api_view(["GET"])
def list_public_activities_view(request):
    public_activities = PublicActivity.objects.order_by("-created_at")

    paginator = CustomPagination()
    page = paginator.paginate_queryset(public_activities, request)
    if page is not None:
        serializer = serializers.PublicActivitySerializer(page, many=True)
        return paginator.get_paginated_response({"items": serializer.data})

    serializer = serializers.PublicActivitySerializer(public_activities, many=True)
    return Response({"items": serializer.data})
