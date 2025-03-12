from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import date
from .models import (
    City, Category, Attraction, EventType, Event, 
    Cuisine, Restaurant, PropertyType, Property,
    TransportType, TransportOption, Review, RSVP, SavedItem
)
from .serializers import (
    CitySerializer, CategorySerializer, AttractionSerializer, 
    EventTypeSerializer, EventSerializer, CuisineSerializer, 
    RestaurantSerializer, PropertyTypeSerializer, PropertySerializer,
    TransportTypeSerializer, TransportOptionSerializer, 
    ReviewSerializer, RSVPSerializer, SavedItemSerializer,
    UserSerializer
)

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class AttractionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Attraction.objects.all()
    serializer_class = AttractionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'category__name']
    
    def get_queryset(self):
        queryset = Attraction.objects.all()
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        city = self.request.query_params.get('city')
        
        if category:
            queryset = queryset.filter(category__name=category)
        if featured:
            queryset = queryset.filter(featured=True)
        if city:
            queryset = queryset.filter(city__name=city)
            
        return queryset

class EventTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by('date', 'time')
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'event_type__name']
    
    def get_queryset(self):
        queryset = Event.objects.all().order_by('date', 'time')
        event_type = self.request.query_params.get('event_type')
        featured = self.request.query_params.get('featured')
        city = self.request.query_params.get('city')
        upcoming = self.request.query_params.get('upcoming')
        
        if event_type:
            queryset = queryset.filter(event_type__name=event_type)
        if featured:
            queryset = queryset.filter(featured=True)
        if city:
            queryset = queryset.filter(city__name=city)
        if upcoming:
            # Filter for upcoming events
            queryset = queryset.filter(date__gte=date.today())
            
        return queryset

class CuisineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer

class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'cuisine__name']
    
    def get_queryset(self):
        queryset = Restaurant.objects.all()
        cuisine = self.request.query_params.get('cuisine')
        featured = self.request.query_params.get('featured')
        city = self.request.query_params.get('city')
        
        if cuisine:
            queryset = queryset.filter(cuisine__name=cuisine)
        if featured:
            queryset = queryset.filter(featured=True)
        if city:
            queryset = queryset.filter(city__name=city)
            
        return queryset

class PropertyTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'property_type__name', 'address']
    
    def get_queryset(self):
        queryset = Property.objects.all()
        property_type = self.request.query_params.get('property_type')
        city = self.request.query_params.get('city')
        for_sale = self.request.query_params.get('for_sale')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        bedrooms = self.request.query_params.get('bedrooms')
        
        if property_type:
            queryset = queryset.filter(property_type__name=property_type)
        if city:
            queryset = queryset.filter(city__name=city)
        if for_sale is not None:
            queryset = queryset.filter(for_sale=(for_sale.lower() == 'true'))
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if bedrooms:
            queryset = queryset.filter(bedrooms__gte=bedrooms)
            
        return queryset

class TransportTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportType.objects.all()
    serializer_class = TransportTypeSerializer

class TransportOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportOption.objects.all()
    serializer_class = TransportOptionSerializer
    
    def get_queryset(self):
        queryset = TransportOption.objects.all()
        transport_type = self.request.query_params.get('transport_type')
        city = self.request.query_params.get('city')
        
        if transport_type:
            queryset = queryset.filter(transport_type__name=transport_type)
        if city:
            queryset = queryset.filter(city__name=city)
            
        return queryset

# User-related views (requires authentication)
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RSVPViewSet(viewsets.ModelViewSet):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RSVP.objects.filter(user=self.request.user)
        return RSVP.objects.none()

class SavedItemViewSet(viewsets.ModelViewSet):
    queryset = SavedItem.objects.all()
    serializer_class = SavedItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return SavedItem.objects.filter(user=self.request.user)
        return SavedItem.objects.none()

# Custom endpoints for the homepage
@api_view(['GET'])
def homepage_data(request):
    """Get featured data for the homepage"""
    city_name = request.query_params.get('city', 'Macomb')  # Default to Macomb
    
    city = get_object_or_404(City, name=city_name)
    featured_attractions = Attraction.objects.filter(city=city, featured=True)[:5]
    upcoming_events = Event.objects.filter(
        city=city, 
        date__gte=date.today()
    ).order_by('date', 'time')[:5]
    featured_restaurants = Restaurant.objects.filter(city=city, featured=True)[:5]
    
    data = {
        'city': CitySerializer(city).data,
        'featured_attractions': AttractionSerializer(featured_attractions, many=True).data,
        'upcoming_events': EventSerializer(upcoming_events, many=True).data,
        'featured_restaurants': RestaurantSerializer(featured_restaurants, many=True).data,
    }
    
    return Response(data)

@api_view(['GET'])
def nearby_attractions(request, pk):
    """Get nearby attractions for a specific attraction"""
    try:
        attraction = Attraction.objects.get(pk=pk)
        # Simple implementation: get attractions in the same category and city
        nearby = Attraction.objects.filter(
            city=attraction.city,
            category=attraction.category
        ).exclude(pk=pk)[:5]
        
        serializer = AttractionSerializer(nearby, many=True)
        return Response(serializer.data)
    except Attraction.DoesNotExist:
        return Response(
            {"error": "Attraction not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )

# Additional utility endpoints
@api_view(['GET'])
def search_all(request):
    """Search across multiple types of content"""
    query = request.query_params.get('q', '')
    if not query or len(query) < 3:
        return Response(
            {"error": "Search query must be at least 3 characters long"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    attractions = Attraction.objects.filter(name__icontains=query)[:5]
    events = Event.objects.filter(name__icontains=query)[:5]
    restaurants = Restaurant.objects.filter(name__icontains=query)[:5]
    properties = Property.objects.filter(title__icontains=query)[:5]
    
    data = {
        'attractions': AttractionSerializer(attractions, many=True).data,
        'events': EventSerializer(events, many=True).data,
        'restaurants': RestaurantSerializer(restaurants, many=True).data,
        'properties': PropertySerializer(properties, many=True).data,
    }
    
    return Response(data)

@api_view(['GET'])
def city_overview(request, city_name):
    """Get an overview of a city with summary statistics"""
    city = get_object_or_404(City, name=city_name)
    
    attraction_count = Attraction.objects.filter(city=city).count()
    restaurant_count = Restaurant.objects.filter(city=city).count()
    event_count = Event.objects.filter(city=city, date__gte=date.today()).count()
    property_count = Property.objects.filter(city=city).count()
    
    data = {
        'city': CitySerializer(city).data,
        'stats': {
            'attractions': attraction_count,
            'restaurants': restaurant_count,
            'upcoming_events': event_count,
            'properties': property_count,
        }
    }
    
    return Response(data)
