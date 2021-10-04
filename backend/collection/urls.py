from django.urls import path
from collection import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("", views.collection_list),
    path("<int:pk>/", views.collection_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
