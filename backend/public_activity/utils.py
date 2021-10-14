from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels_redis.core import RedisChannelLayer


def get_user_key(user_id: int):
    return "public_activity_%s" % user_id


def broadcast_payload(user_id: int, payload: dict):
    channel_layer = get_channel_layer()
    if isinstance(channel_layer, RedisChannelLayer):
        async_to_sync(channel_layer.group_send)(
            get_user_key(user_id),
            {
                "type": "publish_message",
                "payload": payload,
            },
        )
