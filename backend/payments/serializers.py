from rest_framework import serializers
from .models import Payment
from orders.models import Order

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = ["user", "status", "checkout_url"]

    def validate(self, data):
        order = data["order"]

        # 🔐 SECURITY: verify order belongs to user
        request = self.context["request"]
        if order.user != request.user:
            raise serializers.ValidationError("Invalid order")

        # 🔐 SECURITY: verify amount
        if float(data["amount"]) != float(order.total):
            raise serializers.ValidationError("Amount mismatch")

        return data