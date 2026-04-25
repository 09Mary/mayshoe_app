from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Everyone can VIEW
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only admin can modify
        return request.user and request.user.is_staff