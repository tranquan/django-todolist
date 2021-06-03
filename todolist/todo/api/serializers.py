from rest_framework.fields import Field, ReadOnlyField
from rest_framework.serializers import ModelSerializer

from todolist.todo.models import TodoItem


class TodoItemSerializer(ModelSerializer):
    uid = ReadOnlyField(source='id')

    class Meta:
        model = TodoItem
        fields = ["uid", "title", "description"]
