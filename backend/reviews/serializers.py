from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    shoe_name = serializers.CharField(source='shoe.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'shoe', 'shoe_name', 'rating', 'comment', 'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['user', 'is_approved', 'created_at', 'updated_at']


class AdminReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    shoe_name = serializers.CharField(source='shoe.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'shoe', 'shoe_name', 'rating', 'comment', 'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']