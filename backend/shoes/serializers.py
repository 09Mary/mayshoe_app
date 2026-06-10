from rest_framework import serializers
from .models import Shoe, ShoeSize


class ShoeSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ShoeSize
        fields = ('id', 'size', 'stock')


class ShoeSerializer(serializers.ModelSerializer):
    sizes        = ShoeSizeSerializer(many=True, read_only=True)
    is_available = serializers.SerializerMethodField()
    total_stock  = serializers.SerializerMethodField()

    class Meta:
        model  = Shoe
        fields = (
            'id', 'name', 'brand', 'color', 'category', 'price',
            'description', 'image',
            'is_new_launch', 'is_timely_shop',
            'availability_start', 'availability_end',
            'is_active', 'created_at',
            'sizes', 'is_available', 'total_stock',
        )

    def get_is_available(self, obj):
        return obj.is_available()

    def get_total_stock(self, obj):
        return obj.total_stock()