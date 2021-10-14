import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels_redis.core import RedisChannelLayer

from . import utils


class PublicActivityConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope["user"]
        if user.is_anonymous or not user.is_authenticated:
            self.close()

        self.user_key = utils.get_user_key(user.user_id)

        if isinstance(self.channel_layer, RedisChannelLayer):
            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                self.user_key,
                self.channel_name,
            )

            self.accept()

    def disconnect(self, close_code):
        if isinstance(self.channel_layer, RedisChannelLayer):
            # Leave room group
            async_to_sync(self.channel_layer.group_discard)(
                self.user_key,
                self.channel_name,
            )

    def publish_payload(self, event):
        payload = event["payload"]

        if isinstance(self.channel_layer, RedisChannelLayer):
            # Send payload to WebSocket
            self.send(text_data=json.dumps({
                "payload": payload,
            }))
