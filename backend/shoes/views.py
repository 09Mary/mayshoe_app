from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .filters import ShoeFilter
from .models import Shoe
from .serializers import ShoeSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class ShoeViewSet(viewsets.ModelViewSet):
    queryset           = Shoe.objects.filter(is_active=True).prefetch_related('sizes').order_by('-id')
    serializer_class   = ShoeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends    = [DjangoFilterBackend]
    filterset_class    = ShoeFilter


@api_view(['GET'])
def categories(request):
    cats = [{"name": k, "label": v} for k, v in Shoe.CATEGORY_CHOICES]
    return Response(cats)


@api_view(['GET'])
def shoe_detail(request, id):
    try:
        shoe = Shoe.objects.prefetch_related('sizes').get(id=id)
        return Response(ShoeSerializer(shoe).data)
    except Shoe.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def latest_shoe(request):
    """Shoe marked ⭐ New Launch, or the most recently added active shoe."""
    shoe = (
        Shoe.objects.filter(is_active=True, is_new_launch=True)
                    .prefetch_related('sizes')
                    .order_by('-created_at')
                    .first()
        or
        Shoe.objects.filter(is_active=True)
                    .prefetch_related('sizes')
                    .order_by('-created_at')
                    .first()
    )
    if not shoe:
        return Response({"error": "No shoes found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(ShoeSerializer(shoe).data)


@api_view(['GET'])
def timely_shoes(request):
    """All shoes marked 🕐 Timely Shop, respecting optional date window."""
    now   = timezone.now()
    shoes = Shoe.objects.filter(is_active=True, is_timely_shop=True).prefetch_related('sizes')

    result = []
    for shoe in shoes:
        start_ok = shoe.availability_start is None or shoe.availability_start <= now
        end_ok   = shoe.availability_end   is None or shoe.availability_end   >= now
        if start_ok and end_ok:
            result.append(shoe)

    return Response(ShoeSerializer(result, many=True).data)