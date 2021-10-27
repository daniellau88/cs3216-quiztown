from django.urls import include, path

urlpatterns = [
    path("auth/", include("authentication.urls")),
    path("collections/", include("collection.urls")),
    path("cards/", include("card.urls")),
    path("uploads/", include("upload.urls")),
    path("publicActivities/", include("public_activity.urls")),
    path("user/", include("user.urls")),
]
