from django.db import models
from django.utils import timezone

class Shoe(models.Model):
    CATEGORY_CHOICES = (
        ('sneakers', 'Sneakers'),
        ('running', 'Running'),
        ('casual', 'Casual'),
        ('boots', 'Boots'),
        ('heels', 'Heels'),
    )

    
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100, null=True, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    color = models.CharField(max_length=50, null=True, blank=True)
    size = models.CharField(max_length=20, null=True, blank=True)

    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='shoes/', null=True, blank=True)
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='sneakers')


    # 🔥 Availability system
    availability_start = models.DateTimeField(null=True, blank=True)
    availability_end = models.DateTimeField(null=True, blank=True)

    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_available(self):
        now = timezone.now()

        if not self.is_active:
            return False

        if self.availability_start and now < self.availability_start:
            return False

        if self.availability_end and now > self.availability_end:
            return False

        return self.stock > 0

    def __str__(self):
        return self.name