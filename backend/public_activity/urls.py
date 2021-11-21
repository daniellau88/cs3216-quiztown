from django.urls import path

from . import views

urlpatterns = [
    path("", views.list_public_activities_view),
    path("<int:pk>/", views.update_public_activities_view),
]
