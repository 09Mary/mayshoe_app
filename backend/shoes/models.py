from django.db import models
from django.utils import timezone


class Shoe(models.Model):
    CATEGORY_CHOICES = (
        ('sneakers', 'Sneakers'),
        ('running',  'Running'),
        ('casual',   'Casual'),
        ('boots',    'Boots'),
        ('heels',    'Heels'),
    )

    name        = models.CharField(max_length=255)
    brand       = models.CharField(max_length=100, null=True, blank=True)
    color       = models.CharField(max_length=50, null=True, blank=True,
                                   help_text="e.g. Black, White, Red. Each color is its own shoe entry.")
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    image       = models.ImageField(upload_to='shoes/',
                                    null=True, blank=True,
                                    help_text="Main image for this color.")
    category    = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='sneakers')

    # ── Homepage curation ─────────────────────────────────────────────────────
    is_new_launch = models.BooleanField(
        default=False,
        verbose_name="⭐ New Launch",
        help_text="Tick to feature this shoe in the New Launch spotlight. Only one shoe should be ticked.",
    )
    is_timely_shop = models.BooleanField(
        default=False,
        verbose_name="🕐 Timely Shop",
        help_text="Tick to include this shoe in the Timely Shop featured strip.",
    )
    availability_start = models.DateTimeField(
        null=True, blank=True,
        help_text="Optional: hide from Timely Shop before this date.",
    )
    availability_end = models.DateTimeField(
        null=True, blank=True,
        help_text="Optional: hide from Timely Shop after this date.",
    )

    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ── Helpers ───────────────────────────────────────────────────────────────
    def total_stock(self):
        return sum(s.stock for s in self.sizes.all())

    def is_available(self):
        if not self.is_active:
            return False
        return self.total_stock() > 0

    def __str__(self):
        return f"{self.name}{' — ' + self.color if self.color else ''}"

    class Meta:
        ordering = ['-created_at']


class ShoeSize(models.Model):
    """
    One row per size for a shoe/color.
    Admin sees this as an inline table under the shoe — add as many sizes
    as needed and set the stock quantity per size.
    """
    SIZE_CHOICES = [
        ('35', '35'), ('36', '36'), ('37', '37'), ('38', '38'),
        ('39', '39'), ('40', '40'), ('41', '41'), ('42', '42'),
        ('43', '43'), ('44', '44'), ('45', '45'), ('46', '46'),
        ('6',  'US 6'),  ('6.5', 'US 6.5'), ('7',  'US 7'),
        ('7.5','US 7.5'),('8',   'US 8'),   ('8.5','US 8.5'),
        ('9',  'US 9'),  ('9.5', 'US 9.5'), ('10', 'US 10'),
        ('10.5','US 10.5'),('11','US 11'),  ('12', 'US 12'),
    ]

    shoe  = models.ForeignKey(Shoe, on_delete=models.CASCADE, related_name='sizes')
    size  = models.CharField(max_length=10, choices=SIZE_CHOICES)
    stock = models.PositiveIntegerField(default=0, help_text="Units available for this size.")

    class Meta:
        unique_together = ('shoe', 'size')
        ordering        = ['size']

    def __str__(self):
        return f"{self.shoe} / Size {self.size} — {self.stock} in stock"