from django.contrib import admin

from django.apps import apps
from django.contrib import admin
from .models import Shoe

# This shows the Shoe model
@admin.register(Shoe)
class ShoeAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category')
    list_filter = ('category',)