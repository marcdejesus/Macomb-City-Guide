from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class City(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    population = models.IntegerField()
    image = models.ImageField(upload_to='city_images/', null=True, blank=True)
    climate = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name


class Attraction(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='attractions')
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    image = models.ImageField(upload_to='attraction_images/', null=True, blank=True)
    opening_hours = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='attractions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class EventType(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class Event(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='events')
    venue = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    website = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class Cuisine(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    cuisine = models.ForeignKey(Cuisine, on_delete=models.CASCADE, related_name='restaurants')
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    image = models.ImageField(upload_to='restaurant_images/', null=True, blank=True)
    opening_hours = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='restaurants')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class PropertyType(models.Model):
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Property Types"
    
    def __str__(self):
        return self.name


class Property(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    property_type = models.ForeignKey(PropertyType, on_delete=models.CASCADE, related_name='properties')
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    size = models.IntegerField(help_text="Size in square feet")
    image = models.ImageField(upload_to='property_images/', null=True, blank=True)
    for_sale = models.BooleanField(default=True)  # True for sale, False for rent
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='properties')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Properties"
    
    def __str__(self):
        return self.title


class TransportType(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class TransportOption(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    transport_type = models.ForeignKey(TransportType, on_delete=models.CASCADE, related_name='transport_options')
    routes = models.TextField(blank=True, null=True)
    schedule = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='transport_images/', null=True, blank=True)
    website = models.URLField(blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='transport_options')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


# User interaction models
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    content = models.TextField()
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Generic foreign key fields - can be linked to attractions, restaurants, etc.
    content_type = models.ForeignKey('contenttypes.ContentType', on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    
    def __str__(self):
        return f"Review by {self.user.username} - {self.rating}/5"


class RSVP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rsvps')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'event')
        verbose_name = "RSVP"
        verbose_name_plural = "RSVPs"
    
    def __str__(self):
        return f"{self.user.username} - {self.event.name}"


class SavedItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_items')
    
    # Generic foreign key fields
    content_type = models.ForeignKey('contenttypes.ContentType', on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'content_type', 'object_id')
    
    def __str__(self):
        return f"{self.user.username}'s saved item"
