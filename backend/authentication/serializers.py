from rest_framework import serializers


class LoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=100)
    password = serializers.CharField(required=True, max_length=100)


class GoogleLoginRequestSerializer(serializers.Serializer):
    token_id = serializers.CharField(required=True, max_length=2048)
