from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Shoe
from .serializers import ShoeSerializer
from rest_framework import filters

class ShoeViewSet(ModelViewSet):
    queryset = Shoe.objects.all()
    serializer_class = ShoeSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'brand__name']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        now = timezone.now()
        return Shoe.objects.filter(
            is_active=True,
            availability_start__lte=now,
            availability_end__gte=now
        )