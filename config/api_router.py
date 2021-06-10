from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from todolist.todo.api.views import TodoListViewSet
from todolist.users.api.views import AccountViewSet, UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("accounts", AccountViewSet)
router.register("users", UserViewSet)
router.register("todo/todo_list", TodoListViewSet)


app_name = "api"
urlpatterns = router.urls
