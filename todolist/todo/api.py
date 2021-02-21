from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from .models import TodoItem
from .serializers import TodoItemSerializer


class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer


def success_response(data, status_code=status.HTTP_200_OK):
    return Response(
        {
            "success": True,
            "data": data,
        },
        status=status_code,
    )


def error_response(error, error_message=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response(
        {"success": False, "error": error, "error_message": error_message},
        status=status_code,
    )


@api_view(["GET", "POST"])
def list(request):
    items = TodoItem.objects.all()
    seri = TodoItemSerializer(instance=items, many=True)
    return success_response(seri.data)


@api_view(["GET", "PUT", "DELETE"])
def todo_item(request, item_id):
    try:
        item = TodoItem.objects.get(pk=item_id)
    except TodoItem.DoesNotExist:
        return error_response("item not found")

    if request.method == "GET":
        seri = TodoItemSerializer(instance=item)
        return success_response(seri.data)

    elif request.method == "DELETE":
        item.delete()
        return success_response(None)

    elif request.method == "PUT":
        seri = TodoItemSerializer(data=request.data, partial=True)
        if seri.is_valid():
            props = ["title", "description"]
            for p in props:
                if p in seri.validated_data:
                    setattr(item, p, seri.validated_data.get(p))
            item.save()
            return success_response(TodoItemSerializer(instance=item).data)
        else:
            return error_response(seri.errors)

    return error_response("unknown")


@api_view(["POST"])
def create(request):
    seri = TodoItemSerializer(data=request.data)
    if seri.is_valid():
        item = TodoItem.objects.create(**seri.validated_data)
        return success_response(TodoItemSerializer(instance=item).data)
    else:
        return error_response(seri.errors)
