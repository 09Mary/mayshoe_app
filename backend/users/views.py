from rest_framework import generics
from .models import User
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
import rest_framework.permissions

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(APIView):
    permission_classes = [rest_framework.permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })    