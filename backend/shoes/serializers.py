# shoes/serializers.py

from rest_framework import serializers
from .models import Shoe

class ShoeSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Shoe
        fields = "__all__"

    def get_is_available(self, obj):
        return obj.is_available()