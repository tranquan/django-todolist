from rest_framework.serializers import ModelSerializer

from todolist.todo.models import TodoItem


class TodoItemSerializer(ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ["id", "title", "description"]
