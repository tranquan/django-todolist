from django.core.checks.messages import Error
from django.db.models import Q
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from todolist.todo.api.serializers import TodoItemSerializer
from todolist.todo.models import TodoItem


class TodoListViewSet(ModelViewSet):
    serializer_class = TodoItemSerializer
    queryset = TodoItem.objects.all()
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["get"])
    def search(self, request):
        search = request.query_params['search']
        items = TodoItem.objects.filter(Q(title__contains=f'{search}') | Q(description__contains=f'{search}'))
        serilizer = TodoItemSerializer(instance=items, many=True)
        return Response(serilizer.data)
