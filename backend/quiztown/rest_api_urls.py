from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

schema_view = get_schema_view(
    openapi.Info(
        title="Quiztown API",
        default_version="v1",
        description="Quiztown Backend API",
    ),
    url="https://quiztown.fun/",
    public=True,
)

urlpatterns = [
    path("", schema_view.with_ui("swagger", cache_timeout=0)),
    path("auth/", include("authentication.urls")),
    path("collections/", include("collection.urls")),
    path("cards/", include("card.urls")),
    path("uploads/", include("upload.urls")),
    path("publicActivities/", include("public_activity.urls")),
    path("user/", include("user.urls")),
]
