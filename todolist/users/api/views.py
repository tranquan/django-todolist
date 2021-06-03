from enum import Enum
from typing import Dict

from django.contrib.auth import authenticate, get_user_model
from rest_framework import permissions, serializers, status
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.viewsets import GenericViewSet

from .serializers import UserSerializer

User = get_user_model()


class SuccessResponse(Response):

    def __init__(self, data=None,
                 status=None, template_name=None, headers=None, exception=None, content_type=None):
        success_data = {
            'success': True,
            'data': data
        }
        super().__init__(data=success_data,
                         status=status, template_name=template_name,
                         headers=headers, exception=exception, content_type=content_type)


class ErrorResponse(Response):
    def __init__(self, error, error_message=None,
                 status=status.HTTP_400_BAD_REQUEST, template_name=None, headers=None, exception=None,
                 content_type=None):
        error_data = {
            'success': False,
            'error': error,
            'error_message': error_message,
        }
        super().__init__(data=error_data,
                         status=status, template_name=template_name,
                         headers=headers, exception=exception, content_type=content_type)


class WrongPasswordResponse(ErrorResponse):
    def __init__(self, error, error_message, status, template_name, headers, exception, content_type):
        super().__init__(error="WrongPasswordResponse", error_message=error_message, status=status,
                         template_name=template_name, headers=headers, exception=exception, content_type=content_type)


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'username'

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False, methods=['GET'])
    def me(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class WrongPasswordException(APIException):
    status_code = 400
    default_code = 'WrongPassword'
    default_detail = 'Wrong password. Please try again'


class AdminUserException(APIException):
    status_code = 400
    default_code = 'AdminUser'
    default_detail = {
        "admin": True,
        "detail": "Please user another url"
    }


class SimpleError(APIException):
    status_code = 400
    default_code = 'SimpleError'
    default_detail = 'Something went wrong. Please try again'

    def __init__(self, detail):
        super().__init__(detail=detail)


class ComplexError(APIException):
    status_code = 400
    default_code = {}
    default_detail = None

    def __init__(self, reason: str, user_id: str, user_name: str):
        super().__init__(code={
            user_id,
            user_name,
            reason,
        })


class KycErrorCode(Enum):
    MissingEmail = 1
    MissingSignature = 2,


class KycError(APIException):
    status_code = 400
    default_code = KycErrorCode.MissingEmail
    default_detail = None

    def __init__(self, code: KycErrorCode):
        super().__init__(code=code)


class LoginParamSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=200)
    password = serializers.CharField(max_length=200)


class TestExceptionParamSerializer(serializers.Serializer):
    test = serializers.IntegerField()


class AccountViewSet(GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['POST'])
    def login(self, request):
        # TODO: refactor validate inputs
        seri = LoginParamSerializer(data=request.data)
        if seri.is_valid():
            username = seri.validated_data['username']
            password = seri.validated_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                return SuccessResponse(data=True)
            else:
                return ErrorResponse(error="wrong password")
        else:
            return ErrorResponse(error=seri.errors)

    """
    The idea i use exception to return error type
    """
    @action(detail=False, methods=['POST'])
    def test_exception(self, request):
        seri = TestExceptionParamSerializer(data=request.data)
        if seri.is_valid(raise_exception=True):
            test = seri.validated_data['test']
            if test == 0:
                """
                expected:
                {
                    success: True,
                    data: True,
                    error: None,
                    error_messagfe: None
                }
                """
                return Response(True)
            elif test == 1:
                """
                expected:
                {
                    success: False,
                    data: None,
                    error: SimpleError,
                    error_messagfe: "Override something went wrong: param 1 is went wrong"
                }
                """
                raise SimpleError("Override something went wrong: param 1 is went wrong")
            elif test == 2:
                """
                expected:
                {
                    success: False,
                    data: None,
                    error: MissingEmail,
                    error_messagfe: None
                }
                """
                raise KycError(KycErrorCode.MissingEmail)
            elif test == 3:
                """
                expected:
                {
                    success: False,
                    data: None,
                    error: MissingSignature,
                    error_messagfe: None
                }
                """
                raise KycError(KycErrorCode.MissingSignature)
            elif test == 4:
                """
                expected:
                {
                    success: False,
                    data: None,
                    error: MissingSignature,
                    error_messagfe: None
                }
                """
                raise ComplexError("123", "456", "789")
