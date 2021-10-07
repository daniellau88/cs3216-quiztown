from rest_framework import serializers


class UploadFileSerializer(serializers.Serializer):
    file = serializers.FileField()


class UploadFileResponseSerializer(serializers.Serializer):
    file_key = serializers.CharField(max_length=50)
    file_name = serializers.CharField(max_length=100)
