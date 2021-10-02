from django.urls import path

from .views import TestView

# To be removed once have more than 1 path
# fmt: off
urlpatterns = [
    path("test", TestView.as_view(), name="test"),
]
