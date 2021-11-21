from django.urls import path

from collection import views

urlpatterns = [
    path("", views.list_or_create_collection_view),
    path("<int:pk>/", views.get_or_update_or_delete_collection_view),
    path("<int:pk>/import/", views.import_file_collection_view),
    path("<int:pk>/importText/", views.import_text_collection_view),
    path("<int:pk>/imports/", views.list_collection_import_view),
    path("<int:pk>/imports/<int:pkImport>/", views.get_collection_import_view),
    path("<int:pk>/imports/<int:pkImport>/review/", views.review_collection_import_view),
    path("<int:pk>/duplicate/", views.duplicate_collection_view),
    path("tags/", views.list_tag_view),
]
