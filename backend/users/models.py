import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.UUIDField(default=uuid.uuid4, editable=False, null=True, blank=True)

    # Role system (clean + scalable)
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    # Optional profile fields (useful for your project)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    # Helper methods (VERY useful for permissions)
    @property
    def is_customer(self):
        return self.role == 'customer'

    @property
    def is_admin_user(self):
        return self.role == 'admin'