import uuid

from django import forms
from rest_framework.decorators import api_view
from rest_framework.response import Response

from quiztown.common.decorators import validate_request_data

from . import serializers

UPLOAD_DIRECTORY = "uploads/"


# TODO: have separate server to handle uploading
@api_view(["POST"])
@validate_request_data(serializers.UploadFileSerializer)
def upload_view(request, serializer):
    f = request.FILES["file"]
    name_split_by_fullstop = f.name.split(".")

    file_key = str(uuid.uuid4())
    file_key_with_extension = ""
    if len(name_split_by_fullstop) > 1:
        file_key_with_extension = file_key + "." + name_split_by_fullstop[-1]
    else:
        file_key_with_extension = file_key

    new_file_name = UPLOAD_DIRECTORY + file_key_with_extension

    with open(new_file_name, "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)

    response = {
        "file_name": f.name,
        "file_key": file_key_with_extension,
    }

    response_serializer = serializers.UploadFileResponseSerializer(response)

    return Response({"file": response_serializer.data})
