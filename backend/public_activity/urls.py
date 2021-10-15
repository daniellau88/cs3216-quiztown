from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.list_public_activities_view),
    path("<int:pk>/", views.update_public_activities_view),
]

urlpatterns = format_suffix_patterns(urlpatterns)
