from django.urls import path

from . import views

urlpatterns = [
    path("test/", views.test_view, name="test"),
    path("login/", views.login_view, name="login"),
    path("googleLogin/", views.google_login_view, name="google-login"),
    path("logout/", views.logout_view, name="logout"),
]
