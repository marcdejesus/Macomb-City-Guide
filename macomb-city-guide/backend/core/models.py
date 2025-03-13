from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from django.urls import reverse
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# Base model for common fields
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

# City model
class City(BaseModel):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=50, default="Michigan")
    description = models.TextField(blank=True)
    population = models.IntegerField(default=0)
    climate = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='cities/', blank=True, null=True)
    
    def __str__(self):
        return f"{self.name}, {self.state}"
    
    class Meta:
        verbose_name_plural = "Cities"

# Category for attractions
class Category(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

# Attraction model
class Attraction(BaseModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    address = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="attractions")
    opening_hours = models.CharField(max_length=255, blank=True)
    website = models.URLField(blank=True)
    price = models.CharField(max_length=100, blank=True)
    featured = models.BooleanField(default=False)
    image = models.ImageField(upload_to='attractions/', blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="attractions")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    rating = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('attraction-detail', kwargs={'slug': self.slug})
        
    def __str__(self):
        return self.name

# Cuisine for restaurants
class Cuisine(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

# Restaurant model
class Restaurant(BaseModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    address = models.CharField(max_length=255)
    cuisine = models.ForeignKey(Cuisine, on_delete=models.CASCADE, related_name="restaurants")
    opening_hours = models.CharField(max_length=255, blank=True)
    website = models.URLField(blank=True)
    price_level = models.IntegerField(default=2)  # 1=$, 2=$$, 3=$$$
    featured = models.BooleanField(default=False)
    image = models.ImageField(upload_to='restaurants/', blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="restaurants")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    rating = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name
        
    @property
    def price(self):
        return "$" * self.price_level

# Only define this in one file, like core/models.py
class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    restaurant = models.ForeignKey('Restaurant', related_name='menu_items', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name

# Event type
class EventType(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

# Event model
class Event(BaseModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name="events")
    venue = models.CharField(max_length=200)
    address = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    website = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="events")
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name

# Property type
class PropertyType(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

# Property model
class Property(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    slug = models.SlugField(max_length=255, unique=True)  # Add this field
    property_type = models.ForeignKey('PropertyType', on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    size = models.PositiveIntegerField(help_text="Size in square feet", null=True, blank=True)
    address = models.CharField(max_length=255)
    city = models.ForeignKey('City', on_delete=models.PROTECT)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    features = models.TextField(null=True, blank=True)
    year_built = models.PositiveSmallIntegerField(null=True, blank=True)
    for_sale = models.BooleanField(default=True)
    for_rent = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)  # Add this field
    image = models.ImageField(upload_to='properties/', null=True, blank=True)
    detail_url = models.URLField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Properties"

# Property additional images
class PropertyImage(BaseModel):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="additional_images")
    image = models.ImageField(upload_to='properties/additional/')
    
    def __str__(self):
        return f"Image for {self.property.title}"

# Transport type
class TransportType(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

# Transport option
class TransportOption(BaseModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    transport_type = models.ForeignKey(TransportType, on_delete=models.CASCADE, related_name="options")
    address = models.CharField(max_length=255, blank=True)
    routes = models.CharField(max_length=255, blank=True)  # For bus routes, etc.
    schedule = models.TextField(blank=True)  # For operating hours/schedules
    website = models.URLField(blank=True)
    image = models.ImageField(upload_to='transport/', blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="transport_options")
    featured = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name

# User interaction models
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s review for {self.content_type} #{self.object_id}"

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

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'content_type', 'object_id')
        ordering = ['-created_at']

class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
