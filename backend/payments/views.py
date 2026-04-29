from rest_framework import generics, permissions
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
import uuid

class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        order = serializer.validated_data["order"]

        # 🧾 Create payment
        payment = serializer.save(
            user=self.request.user,
            status="PENDING"
        )

        # 💳 Simulate checkout URL (replace later with real gateway)
        checkout_url = f"http://localhost:3000/pay/{uuid.uuid4()}"

        payment.checkout_url = checkout_url
        payment.status = "SUCCESS"  # simulate instant payment
        payment.save()

        # 📦 Update order status
        order.status = "PAID"
        order.save()