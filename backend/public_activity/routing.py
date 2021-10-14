from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/subscribePublicActivity/$",
            consumers.PublicActivityConsumer.as_asgi()),
]
