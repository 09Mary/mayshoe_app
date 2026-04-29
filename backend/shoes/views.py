# shoes/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Shoe
from .serializers import ShoeSerializer
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ShoeFilter

class ShoeViewSet(viewsets.ModelViewSet):
    queryset = Shoe.objects.all().order_by("-id")
    serializer_class = ShoeSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = ShoeFilter


# ✅ Categories (derived)
@api_view(['GET'])
def categories(request):
    categories = [
        {"name": key, "label": value}
        for key, value in Shoe.CATEGORY_CHOICES
    ]
    return Response(categories)
 
 
# shoes details
@api_view(['GET'])
def shoe_detail(request, id):
    try:
        shoe = Shoe.objects.get(id=id)
        return Response(ShoeSerializer(shoe).data)
    except Shoe.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

# ✅ New Launch (latest shoe)
@api_view(['GET'])
def latest_shoe(request):
    shoe = Shoe.objects.filter(is_active=True).order_by('-created_at').first()
    return Response(ShoeSerializer(shoe).data)


# ✅ Timely Shop 
@api_view(['GET'])
def timely_shoes(request):
    now = timezone.now()

    shoes = Shoe.objects.filter(
        is_active=True,
        availability_start__lte=now,
        availability_end__gte=now,
        stock__gt=0
    )

    return Response(ShoeSerializer(shoes, many=True).data)