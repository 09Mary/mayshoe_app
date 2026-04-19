from rest_framework.routers import DefaultRouter
from .views import ShoeViewSet

router = DefaultRouter()
router.register('', ShoeViewSet,)

urlpatterns = router.urls