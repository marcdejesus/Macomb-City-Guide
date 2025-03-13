from django.contrib import admin
from .models import *

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'population')
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'city', 'featured')
    list_filter = ('category', 'city', 'featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Cuisine)
class CuisineAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'cuisine', 'price_level', 'city', 'featured')
    list_filter = ('cuisine', 'price_level', 'city', 'featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'event_type', 'date', 'time', 'city', 'featured')
    list_filter = ('event_type', 'date', 'city', 'featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    date_hierarchy = 'date'

@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'image')
    list_filter = ('property',)

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'property_type', 'price', 'bedrooms', 'bathrooms', 'for_sale', 'featured')
    list_filter = ('property_type', 'bedrooms', 'bathrooms', 'for_sale', 'city', 'featured')
    search_fields = ('title', 'description', 'address')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(TransportType)
class TransportTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(TransportOption)
class TransportOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'transport_type', 'city')
    list_filter = ('transport_type', 'city')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
