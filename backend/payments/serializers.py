from rest_framework import serializers
from .models import Payment
from orders.models import Order

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = [
            "user", "status", "checkout_url",
            "mpesa_checkout_request_id", "mpesa_receipt_number",
        ]

    def validate(self, data):
        order = data["order"]
        request = self.context["request"]

        if order.user != request.user:
            raise serializers.ValidationError("Invalid order")

        if float(data["amount"]) != float(order.total_price):
            raise serializers.ValidationError("Amount mismatch")

        return data