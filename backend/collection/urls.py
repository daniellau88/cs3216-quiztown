from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from collection import views

urlpatterns = [
    path("", views.list_or_create_collection_view),
    path("<int:pk>/", views.get_or_update_or_delete_collection_view),
    path("<int:pk>/import/", views.import_collection_view),
]

urlpatterns = format_suffix_patterns(urlpatterns)
