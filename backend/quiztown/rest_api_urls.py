from django.urls import include, path

urlpatterns = [
    path("auth/", include("authentication.urls")),
    path("collections/", include("collection.urls")),
]
