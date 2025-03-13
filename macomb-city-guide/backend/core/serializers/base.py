# core/serializers/base.py
from rest_framework import serializers
from core.models import City, Category

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# core/serializers/attraction.py
from rest_framework import serializers
from core.models import Attraction
from .base import CategorySerializer, CitySerializer

class AttractionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    
    class Meta:
        model = Attraction
        fields = '__all__'

class AttractionDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Attraction
        fields = '__all__'

# Similar serializers for Event, Restaurant, Property, and TransportOption