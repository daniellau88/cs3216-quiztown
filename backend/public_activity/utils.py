from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels_redis.core import RedisChannelLayer

from public_activity import serializers
from public_activity.models import PublicActivity


def get_user_key(user_id: int):
    return "public_activity_%s" % user_id


def broadcast_public_activity(public_activity: PublicActivity):
    serializer = serializers.PublicActivitySerializer(public_activity)
    channel_layer = get_channel_layer()
    if isinstance(channel_layer, RedisChannelLayer):
        async_to_sync(channel_layer.group_send)(
            get_user_key(public_activity.user_id),
            {
                "type": "publish_payload",
                "payload": {
                    "item": serializer.data,
                },
            },
        )
