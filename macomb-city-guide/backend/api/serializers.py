from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from core.models import *

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
    
    class Meta:
        model = Attraction
        fields = '__all__'

class AttractionDetailSerializer(AttractionSerializer):
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta(AttractionSerializer.Meta):
        pass

class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    cuisine_name = serializers.ReadOnlyField(source='cuisine.name')
    price = serializers.CharField(read_only=True)
    
    class Meta:
        model = Restaurant
        fields = '__all__'

class RestaurantDetailSerializer(RestaurantSerializer):
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta(RestaurantSerializer.Meta):
        pass

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    event_type_name = serializers.ReadOnlyField(source='event_type.name')
    formatted_date = serializers.SerializerMethodField()
    formatted_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__'
        
    def get_formatted_date(self, obj):
        return obj.date.strftime('%B %d, %Y')
        
    def get_formatted_time(self, obj):
        return obj.time.strftime('%I:%M %p')

class EventDetailSerializer(EventSerializer):
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta(EventSerializer.Meta):
        pass

class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertySerializer(serializers.ModelSerializer):
    property_type_name = serializers.StringRelatedField(source='property_type')
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = ['id', 'title', 'price', 'bedrooms', 'bathrooms', 'size', 
                  'address', 'property_type', 'property_type_name', 'for_sale', 
                  'for_rent', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

class PropertyDetailSerializer(PropertySerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    
    class Meta(PropertySerializer.Meta):
        fields = PropertySerializer.Meta.fields + ['description', 'features', 'year_built', 'images']

class TransportTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportType
        fields = '__all__'

class TransportOptionSerializer(serializers.ModelSerializer):
    transport_type_name = serializers.ReadOnlyField(source='transport_type.name')
    
    class Meta:
        model = TransportOption
        fields = '__all__'

class TransportOptionDetailSerializer(TransportOptionSerializer):
    city_name = serializers.ReadOnlyField(source='city.name')
    
    class Meta(TransportOptionSerializer.Meta):
        pass

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['date_joined']

class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    content_type_str = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'content_type', 'content_type_str', 
                  'object_id', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    
    def get_content_type_str(self, obj):
        return obj.content_type.model

class FavoriteSerializer(serializers.ModelSerializer):
    content_type_str = serializers.SerializerMethodField()
    item_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'content_type', 'content_type_str', 'object_id', 'item_details']
        read_only_fields = ['user']
    
    def get_content_type_str(self, obj):
        return obj.content_type.model
    
    def get_item_details(self, obj):
        # Return basic details of the favorited item
        model_class = obj.content_type.model_class()
        item = model_class.objects.get(id=obj.object_id)
        
        # Determine what fields to return based on the model
        if model_class == Attraction:
            return {
                'name': item.name,
                'image': item.image.url if item.image else None,
                'category': item.category.name,
            }
        elif model_class == Restaurant:
            return {
                'name': item.name,
                'image': item.image.url if item.image else None,
                'cuisine': item.cuisine.name,
            }
        elif model_class == Event:
            return {
                'name': item.name,
                'image': item.image.url if item.image else None,
                'date': item.date,
                'venue': item.venue,
            }
        elif model_class == Property:
            return {
                'title': item.title,
                'image': item.image.url if item.image else None,
                'price': item.price,
                'address': item.address,
            }
        return {'id': item.id}

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'user', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['user', 'created_at']