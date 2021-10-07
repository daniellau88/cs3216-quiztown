from django.urls import include, path

urlpatterns = [
    path("auth/", include("authentication.urls")),
    path("collections/", include("collection.urls")),
    path("collections/<int:pk>/cards/", include("card.urls")),
    path("uploads/", include("upload.urls")),
]
