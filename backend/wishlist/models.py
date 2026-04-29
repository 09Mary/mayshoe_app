from django.db import models
from shoes.models import Shoe 
from users.models import User  

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)