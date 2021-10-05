from rest_framework import serializers

from .models import Card

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "flagged",
                  "created_at", "image_link", "next_date"]
