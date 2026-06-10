from django.db import transaction
from django.db.models import F
from rest_framework import serializers
from .models import Order, OrderItem
from shoes.models import Shoe, ShoeSize


class OrderItemSerializer(serializers.ModelSerializer):
    shoe_name  = serializers.CharField(source='shoe.name',  read_only=True)
    shoe_image = serializers.ImageField(source='shoe.image', read_only=True)
    shoe_color = serializers.CharField(source='shoe.color', read_only=True)

    class Meta:
        model  = OrderItem
        fields = ['shoe', 'shoe_name', 'shoe_image', 'shoe_color', 'quantity', 'price']
        read_only_fields = ['price', 'shoe_name', 'shoe_image', 'shoe_color']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'user', 'items', 'payment_method', 'status',
            'total_price', 'shipping_address', 'created_at', 'updated_at',
        ]
        read_only_fields = ['user', 'status', 'total_price', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user       = self.context['request'].user

        # Frontend sends { shoe: id, quantity: n, size_id: n }
        raw_items  = self.context['request'].data.get('items', [])
        size_map   = {str(i.get('shoe')): i.get('size_id') for i in raw_items}

        with transaction.atomic():
            shoe_ids = [item['shoe'].id for item in items_data]
            shoes    = {s.id: s for s in Shoe.objects.select_for_update().filter(id__in=shoe_ids)}

            errors = []
            for item in items_data:
                shoe = shoes[item['shoe'].id]
                qty  = item.get('quantity', 1)
                sid  = size_map.get(str(shoe.id))

                if sid:
                    try:
                        size_obj = ShoeSize.objects.select_for_update().get(id=sid, shoe=shoe)
                        if size_obj.stock < qty:
                            errors.append(
                                f"'{shoe.name}' Size {size_obj.size} only has {size_obj.stock} left."
                            )
                    except ShoeSize.DoesNotExist:
                        errors.append(f"Selected size for '{shoe.name}' is no longer available.")
                else:
                    total = shoe.total_stock()
                    if total < qty:
                        errors.append(f"'{shoe.name}' only has {total} in stock.")

            if errors:
                raise serializers.ValidationError(errors)

            order = Order.objects.create(
                user             = user,
                payment_method   = validated_data.get('payment_method', 'mpesa'),
                shipping_address = validated_data.get('shipping_address', ''),
            )

            total = 0
            for item in items_data:
                shoe = shoes[item['shoe'].id]
                qty  = item.get('quantity', 1)
                sid  = size_map.get(str(shoe.id))

                OrderItem.objects.create(order=order, shoe=shoe, quantity=qty, price=shoe.price)
                total += shoe.price * qty

                if sid:
                    ShoeSize.objects.filter(id=sid).update(stock=F('stock') - qty)
                else:
                    # Deduct from size with most stock as fallback
                    best = shoe.sizes.order_by('-stock').first()
                    if best:
                        ShoeSize.objects.filter(id=best.id).update(stock=F('stock') - qty)

            order.total_price = total
            order.save(update_fields=['total_price'])

        return order