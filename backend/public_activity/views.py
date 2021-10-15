from rest_framework.decorators import api_view
from rest_framework.response import Response

from public_activity import serializers
from quiztown.common.decorators import convert_keys_to_item, validate_request_data
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


@api_view(["PATCH"])
@convert_keys_to_item({"pk": PublicActivity})
@validate_request_data(serializers.PublicActivityUpdateSerializer, is_update=True)
def update_public_activities_view(request, pk_item, serializer):
    serializer.save()
    response_serializer = serializers.PublicActivitySerializer(serializer.instance)
    return Response({"item": response_serializer.data})
