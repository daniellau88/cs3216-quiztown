from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from public_activity import serializers
from quiztown.common import utils
from quiztown.common.decorators import convert_keys_to_item, validate_request_data

from . import helpers


@api_view(["GET"])
def list_public_activities_view(request):
    return utils.filter_model_by_get_request(
        request,
        helpers.get_default_public_activity_queryset_by_request(request),
        serializers.PublicActivitySerializer,
    )


@swagger_auto_schema(
    method="PATCH",
    request_body=serializers.PublicActivityUpdateSerializer,
)
@api_view(["PATCH"])
@convert_keys_to_item({
    "pk": helpers.get_default_public_activity_queryset_by_request,
})
@validate_request_data(
    serializers.PublicActivityUpdateSerializer,
    is_update=True,
    partial=True,
)
def update_public_activities_view(request, pk_item, serializer):
    serializer.save()
    response_serializer = serializers.PublicActivitySerializer(serializer.instance)
    return Response({"item": response_serializer.data})
