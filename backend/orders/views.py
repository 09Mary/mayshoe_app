from django.db.models import F, Sum
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from reviews.models import Review
from shoes.models import Shoe
from shoes.serializers import ShoeSerializer

from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().prefetch_related('items__shoe')
        return Order.objects.filter(user=self.request.user).prefetch_related('items__shoe')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        new_status = serializer.validated_data.get('status', old_status)

        instance = serializer.save()

        # Restore stock when an order is cancelled (only once)
        if new_status == 'cancelled' and old_status not in ('cancelled', 'delivered'):
            for item in instance.items.all():
                Shoe.objects.filter(id=item.shoe_id).update(stock=F('stock') + item.quantity)


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        orders = Order.objects.all()
        revenue = orders.filter(status='paid').aggregate(total=Sum('total_price'))['total'] or 0
        low_stock = Shoe.objects.filter(is_active=True, stock__lte=5).order_by('stock')[:10]

        return Response({
            'total_orders': orders.count(),
            'total_revenue': revenue,
            'pending_orders': orders.filter(status='pending').count(),
            'paid_orders': orders.filter(status='paid').count(),
            'shipped_orders': orders.filter(status='shipped').count(),
            'delivered_orders': orders.filter(status='delivered').count(),
            'cancelled_orders': orders.filter(status='cancelled').count(),
            'low_stock': ShoeSerializer(low_stock, many=True).data,
            'recent_orders': OrderSerializer(
                orders.order_by('-created_at')[:5], many=True
            ).data,
            'pending_reviews': Review.objects.filter(is_approved=False).count(),
        })