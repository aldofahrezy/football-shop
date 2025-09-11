# Create your models here.
import uuid
from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('kits_jerseys', 'Kits & Jerseys'),
        ('footwear', 'Footwear'),
        ('equipment', 'Equipment'),
        ('goalkeeper', 'Goalkeeper'),
        ('clothing', 'Clothing & Apparel'),
        ('fan_shop', 'Fan Shop'),
        ('kids_youth', 'Kids & Youth'),
        ('accessories', 'Accessories'),
    ]

    
    # Attribut wajib
    name = models.CharField(max_length=100)
    price = models.PositiveIntegerField(default=0)
    description = models.TextField()
    thumbnail = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='equipment')
    is_featured = models.BooleanField(default=False)

    # Attribut opsional
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    # bisa nambahin: stock, rating, reviews, discount, brand, etc.

    
    def __str__(self):
        return self.title
    
    @property
    def is_product_hot(self):
        return self.product_views > 20
        
    def increment_views(self):
        self.product_views += 1
        self.save()