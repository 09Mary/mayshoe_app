from rest_framework import viewsets, permissions
from .models import Review
from .serializers import AdminReviewSerializer, ReviewSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()   
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminReviewSerializer
        return ReviewSerializer

    def get_queryset(self):
        qs = Review.objects.select_related('user', 'shoe').order_by('-created_at')
        if self.request.user.is_staff:
            return qs
        return qs.filter(is_approved=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)