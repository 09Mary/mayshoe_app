from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from users.models import User
from shoes.models import Shoe


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'shoe')

    def __str__(self):
        return f"{self.user.username} → {self.shoe.name} ({self.rating}★)"