from django.contrib import admin
from .models import (
    City, Category, Attraction, EventType, Event, 
    Cuisine, Restaurant, PropertyType, Property,
    TransportType, TransportOption, Review, RSVP, SavedItem
)

# Register your models with the admin site
admin.site.register(City)
admin.site.register(Category)
admin.site.register(Attraction)
admin.site.register(EventType)
admin.site.register(Event)
admin.site.register(Cuisine)
admin.site.register(Restaurant)
admin.site.register(PropertyType)
admin.site.register(Property)
admin.site.register(TransportType)
admin.site.register(TransportOption)
admin.site.register(Review)
admin.site.register(RSVP)
admin.site.register(SavedItem)
