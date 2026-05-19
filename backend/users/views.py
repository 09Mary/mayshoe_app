import uuid
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetSerializer,
    RegisterSerializer,
)

FRONTEND_URL = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')


def _send_verification_email(user):
    link = f"{FRONTEND_URL}/verify-email?token={user.email_verification_token}"
    send_mail(
        subject="Verify your Mayshoe account",
        message=f"Hi {user.username},\n\nClick the link below to verify your email:\n{link}\n\nIf you did not create this account, ignore this email.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _send_verification_email(user)
        return Response(
            {"detail": "Account created. Check your email to verify your account."},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = []

    def get(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response({"detail": "Token required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email_verification_token=token)
        except (User.DoesNotExist, ValueError):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.is_email_verified = True
        user.email_verification_token = uuid.uuid4()  # rotate so token can't be reused
        user.save(update_fields=['is_active', 'is_email_verified', 'email_verification_token'])
        return Response({"detail": "Email verified. You can now log in."})


class PasswordResetView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email, is_active=True)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            link = f"{FRONTEND_URL}/reset-password/confirm?uid={uid}&token={token}"
            send_mail(
                subject="Reset your Mayshoe password",
                message=f"Hi {user.username},\n\nClick the link below to reset your password:\n{link}\n\nThis link expires in 24 hours. If you did not request this, ignore this email.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass  # don't reveal whether the email exists
        return Response({"detail": "If that email is registered you will receive a reset link shortly."})


class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data['uid']))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, serializer.validated_data['token']):
            return Response({"detail": "Link has expired. Request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])
        return Response({"detail": "Password updated successfully."})


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "role": user.role,
        })