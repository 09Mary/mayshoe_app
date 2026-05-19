from django.db import transaction
from rest_framework import serializers
from .models import Order, OrderItem
from shoes.models import Shoe


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['shoe', 'quantity', 'price']
        read_only_fields = ['price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'payment_method', 'status', 'total_price', 'shipping_address', 'created_at', 'updated_at']
        read_only_fields = ['user', 'status', 'total_price', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        with transaction.atomic():
            shoe_ids = [item['shoe'].id for item in items_data]

            # Lock rows to prevent concurrent oversell
            shoes = {s.id: s for s in Shoe.objects.select_for_update().filter(id__in=shoe_ids)}

            # Validate stock before touching anything
            errors = []
            for item in items_data:
                shoe = shoes[item['shoe'].id]
                qty = item.get('quantity', 1)
                if shoe.stock < qty:
                    errors.append(f"'{shoe.name}' only has {shoe.stock} in stock.")
            if errors:
                raise serializers.ValidationError(errors)

            order = Order.objects.create(
                user=user,
                payment_method=validated_data.get('payment_method', 'mpesa'),
                shipping_address=validated_data.get('shipping_address', ''),
            )

            total = 0
            for item in items_data:
                shoe = shoes[item['shoe'].id]
                qty = item.get('quantity', 1)
                OrderItem.objects.create(order=order, shoe=shoe, quantity=qty, price=shoe.price)
                total += shoe.price * qty
                shoe.stock -= qty
                shoe.save(update_fields=['stock'])

            order.total_price = total
            order.save(update_fields=['total_price'])

        return order