# core/models/base.py
from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class City(BaseModel):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=2, default="MI")
    description = models.TextField(blank=True, null=True)
    population = models.IntegerField(default=0)
    climate = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.name}, {self.state}"
    
    class Meta:
        verbose_name_plural = "Cities"


class Category(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"


# core/models/attraction.py
class Attraction(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="attractions")
    address = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="attractions")
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    opening_hours = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField(default=0.0)
    price_level = models.IntegerField(default=0)  # 0 = free, 1 = inexpensive, 2 = moderate, 3 = expensive
    image = models.ImageField(upload_to='attractions/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name


# core/models/event.py
class EventType(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class Event(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name="events")
    venue = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="events")
    date = models.DateField()
    time = models.TimeField()
    end_time = models.TimeField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    capacity = models.IntegerField(blank=True, null=True)
    organizer = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.date})"


# core/models/restaurant.py
class Cuisine(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class Restaurant(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    long_description = models.TextField(blank=True, null=True)
    cuisine = models.ForeignKey(Cuisine, on_delete=models.CASCADE, related_name="restaurants")
    category = models.CharField(max_length=100, default="Casual Dining")
    address = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="restaurants")
    hours = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    price = models.CharField(max_length=4, default="$$")
    price_level = models.IntegerField(default=2)  # 1 = $, 2 = $$, 3 = $$$
    rating = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)
    image = models.ImageField(upload_to='restaurants/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return self.title


class MenuItem(BaseModel):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="menu_items")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, default="Main")  # e.g., Starters, Mains, Desserts
    
    def __str__(self):
        return f"{self.name} - {self.restaurant.title}"


# core/models/property.py
class PropertyType(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Property Types"


class Property(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    property_type = models.ForeignKey(PropertyType, on_delete=models.CASCADE, related_name="properties")
    address = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="properties")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.FloatField()
    size = models.IntegerField(help_text="Size in square feet")
    year_built = models.IntegerField(blank=True, null=True)
    lot_size = models.FloatField(blank=True, null=True, help_text="Lot size in acres")
    for_sale = models.BooleanField(default=True)
    for_rent = models.BooleanField(default=False)
    image = models.ImageField(upload_to='properties/', blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Properties"


class PropertyImage(BaseModel):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="additional_images")
    image = models.ImageField(upload_to='property_images/')
    
    def __str__(self):
        return f"Image for {self.property.title}"


# core/models/transportation.py
class TransportType(BaseModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class TransportOption(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    transport_type = models.ForeignKey(TransportType, on_delete=models.CASCADE, related_name="options")
    routes = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="transport_options")
    hours = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    fare = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='transportation/', blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.transport_type})"


class TransportStop(BaseModel):
    transport_option = models.ForeignKey(TransportOption, on_delete=models.CASCADE, related_name="stops")
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} - {self.transport_option.name}"


class TransportSchedule(BaseModel):
    transport_option = models.ForeignKey(TransportOption, on_delete=models.CASCADE, related_name="schedules")
    route = models.CharField(max_length=100)
    direction = models.CharField(max_length=100)
    day_type = models.CharField(max_length=20, default="Weekday")  # Weekday, Saturday, Sunday, Holiday
    
    def __str__(self):
        return f"{self.transport_option.name} - {self.route} {self.direction} ({self.day_type})"


class ScheduleTime(BaseModel):
    schedule = models.ForeignKey(TransportSchedule, on_delete=models.CASCADE, related_name="times")
    stop = models.ForeignKey(TransportStop, on_delete=models.CASCADE, related_name="departure_times")
    departure_time = models.TimeField()
    
    def __str__(self):
        return f"{self.schedule.route} at {self.stop.name}: {self.departure_time}"