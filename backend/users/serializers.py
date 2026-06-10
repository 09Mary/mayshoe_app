from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['role'] = user.role
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model  = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        # Always create inactive — email verification is ALWAYS required.
        # In DEBUG mode, the console email backend prints the link to the
        # terminal so you can still test without a real SMTP server.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False,
            is_email_verified=False,
        )
        return user


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid          = serializers.CharField()
    token        = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])