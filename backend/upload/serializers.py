from rest_framework import serializers


class UploadFileSerializer(serializers.Serializer):
    file = serializers.FileField()


class UploadFileResponseSerializer(serializers.Serializer):
    file_name = serializers.CharField()
    file_key = serializers.CharField()
