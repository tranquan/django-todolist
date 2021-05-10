from django.urls import path

from . import api
from .views import TodoItemList, TodoItemSearch

# TODO: is there anyway to bind path with function in api?
# e.g: I have function: api.delete, and it will auto name here as todo/delete
# Like how blueprint work

# TODO: how to generate react client from django

app_name = "todo"  # set namespace so django can diffs between apps
urlpatterns = [
    path('todo_list/', api.todo_list, name='todo_list'),
    path('todo_item/<int:item_id>', api.todo_item, name='todo_item'),
    path('create/', api.create, name='create'),
    path('list/', TodoItemList.as_view(), name='list'),
    path('search/', TodoItemSearch.as_view(), name='search'),
]
