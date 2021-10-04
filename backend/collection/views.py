from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from collection.serializers import CollectionSerializer

from .models import Collection


@api_view(["GET", "POST"])
def collection_list(request, format=None):
    if request.method == "GET":
        collections = Collection.objects.all()
        serializer = CollectionSerializer(collections, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = CollectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def collection_detail(request, pk, format=None):
    try:
        collection = Collection.objects.get(pk=pk)
    except Collection.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = CollectionSerializer(collection)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = CollectionSerializer(collection, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        collection.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
