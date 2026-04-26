# shoes/urls.py

from django.urls import path
from .views import categories, latest_shoe, shoe_detail, timely_shoes

urlpatterns = [
    path("categories/", categories),
    path("shoes/latest/", latest_shoe),
    path("shoes/timely/", timely_shoes),
    path("shoes/<int:id>/", shoe_detail), 
    ]