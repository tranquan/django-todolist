from django.shortcuts import render
from rest_framework import generics, permissions, renderers, viewsets
from rest_framework.decorators import action, api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from utils.renderers import ApiResponseRenderer

from .models import TodoItem
from .serializers import TodoItemSerializer


class TodoItemList(generics.ListCreateAPIView):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [ApiResponseRenderer]


class TodoItemSearch(APIView):
    # queryset = TodoItem.objects.all()
    # serializer_class = TodoItemSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [ApiResponseRenderer]

    def get(self, request, format=None):
        search = request.query_params['search']
        items = TodoItem.objects.filter(title__contains=f'{search}')
        serilizer = TodoItemSerializer(items, many=True)
        return Response(serilizer.data)
