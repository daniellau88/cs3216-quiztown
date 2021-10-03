from django.urls import path

from .views import login_view, test_view

urlpatterns = [
    path("test", test_view, name="test"),
    path("login", login_view, name="login"),
]
