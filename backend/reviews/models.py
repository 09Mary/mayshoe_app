from django.db import models

from users.models import User
from shoes.models import Shoe

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()