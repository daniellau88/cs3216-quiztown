from django.urls import path

from card import views

urlpatterns = [
    path("", views.list_or_create_card_view),
    path("<int:pk>/", views.get_or_update_or_delete_card_view),
]
