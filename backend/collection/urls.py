from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from collection import views

urlpatterns = [
    path("", views.collection_list),
    path("<int:pk>/", views.collection_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
