from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from user import views

urlpatterns = [
    path("settings/", views.list_or_add_user_settings_view),
]

urlpatterns = format_suffix_patterns(urlpatterns)
