from rest_framework import serializers


class ListRequestSerializer(serializers.Serializer):
    length = serializers.IntegerField(required=False)
    start = serializers.IntegerField(required=False)
    search = serializers.CharField(max_length=30, required=False, allow_blank=True)
    filters = serializers.JSONField(required=False)
    sort_by = serializers.CharField(required=False)
    order = serializers.ChoiceField(choices=["asc", "desc", ""], required=False)


class DateRangeSerializer(serializers.Serializer):
    start = serializers.DateField(required=False)
    end = serializers.DateField(required=False)
