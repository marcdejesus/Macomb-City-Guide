from rest_framework import serializers
from .models import (
    City, Category, Attraction, EventType, Event, 
    Cuisine, Restaurant, PropertyType, Property,
    TransportType, TransportOption, Review, RSVP, SavedItem
)
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class AttractionSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta:
        model = Attraction
        fields = '__all__'

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    event_type_name = serializers.ReadOnlyField(source='event_type.name')
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta:
        model = Event
        fields = '__all__'

class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    cuisine_name = serializers.ReadOnlyField(source='cuisine.name')
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta:
        model = Restaurant
        fields = '__all__'

class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    property_type_name = serializers.ReadOnlyField(source='property_type.name')
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta:
        model = Property
        fields = '__all__'

class TransportTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportType
        fields = '__all__'

class TransportOptionSerializer(serializers.ModelSerializer):
    transport_type_name = serializers.ReadOnlyField(source='transport_type.name')
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta:
        model = TransportOption
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Review
        fields = '__all__'

class RSVPSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    event_name = serializers.ReadOnlyField(source='event.name')
    
    class Meta:
        model = RSVP
        fields = '__all__'

class SavedItemSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = SavedItem
        fields = '__all__'