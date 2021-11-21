from django.urls import path

from . import views

urlpatterns = [
    path("googleLogin/", views.google_login_view, name="google-login"),
    path("logout/", views.logout_view, name="logout"),
    path("user/", views.user_view, name="user"),
    path("updateSettings/", views.update_user_settings_view, name="update_settings"),
]
