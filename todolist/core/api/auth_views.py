from django.contrib.auth import get_user_model, login
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet

from todolist.users.api.serializers import UserSerializer

User = get_user_model()


class AuthViewSet(GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=["POST"])
    def login(request):
