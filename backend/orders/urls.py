from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AdminStatsView, OrderViewSet

router = DefaultRouter()
router.register('', OrderViewSet, basename='orders')

urlpatterns = router.urls + [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
]