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
        fields = [
            'id',
            'user',
            'items',
            'payment_method',
            'status',
            'total_price',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['user', 'status', 'total_price', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        order = Order.objects.create(
            user=user,
            payment_method=validated_data['payment_method']
        )

        total = 0

        for item in items_data:
            shoe = item['shoe']
            quantity = item.get('quantity', 1)
            price = shoe.price

            OrderItem.objects.create(
                order=order,
                shoe=shoe,
                quantity=quantity,
                price=price
            )

            total += price * quantity

        order.total_price = total
        order.save()

        return order