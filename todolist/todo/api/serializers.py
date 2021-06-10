from rest_framework.fields import CharField, ReadOnlyField
from rest_framework.serializers import ModelSerializer

from todolist.todo.models import TodoItem


class TodoItemSerializer(ModelSerializer):
    uid = ReadOnlyField(source='id')
    description = CharField(required=False)

    class Meta:
        model = TodoItem
        fields = ["uid", "title", "description"]
