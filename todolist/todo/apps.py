from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class TodoConfig(AppConfig):
    name = 'todolist.todo'
    verbose_name = _("Todo")
