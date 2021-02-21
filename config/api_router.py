from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from todolist.users.api.views import UserViewSet
from todolist.todo.api import TodoItemViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("todos", TodoItemViewSet)


app_name = "api"
urlpatterns = router.urls
