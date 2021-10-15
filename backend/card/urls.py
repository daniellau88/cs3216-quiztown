from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from card import views

urlpatterns = [
    path("", views.list_or_create_card_view),
    path("<int:pk>/", views.get_or_update_or_delete_card_view),
    path("import/", views.import_card_view),
]

urlpatterns = format_suffix_patterns(urlpatterns)
