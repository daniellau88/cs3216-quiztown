from django.db import models

# Create your models here.


class Collection(models.Model):
    name = models.CharField(max_length=30)
    owner_id = models.IntegerField()
    private = models.IntegerField(default=1)
    created_at = models.IntegerField()

    def create(self, validated_data):
        return Collection.objects.create(validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.owner_id = validated_data.get('owner_id', instance.owner_id)
        instance.private = validated_data.get('private', instance.private)
        instance.created_at = validated_data.get('created_at', instance.created_at)
        instance.save()
        return instance
