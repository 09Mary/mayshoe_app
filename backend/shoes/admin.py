from django.contrib import admin

from django.apps import apps
from django.contrib import admin
from .models import Shoe

# This shows the Shoe model
admin.site.register(Shoe)