from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ShoeViewSet, categories, shoe_detail, latest_shoe, timely_shoes

router = DefaultRouter()
router.register(r'', ShoeViewSet, basename='shoe')

urlpatterns = [
    path('latest/',          latest_shoe,  name='shoe-latest'),
    path('timely/',          timely_shoes, name='shoe-timely'),
    path('categories/',      categories,   name='shoe-categories'),
    path('<int:id>/detail/', shoe_detail,  name='shoe-detail'),
] + router.urls