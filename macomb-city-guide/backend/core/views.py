from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from datetime import date, datetime
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
    UserSerializer, AttractionDetailSerializer, RestaurantDetailSerializer,
    EventDetailSerializer, PropertyDetailSerializer
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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'rating']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AttractionDetailSerializer
        return AttractionSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Attraction.objects.filter(featured=True)[:6]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

class CuisineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer

class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cuisine', 'price_level', 'featured']
    search_fields = ['name', 'description', 'address']
    ordering_fields = ['name', 'rating', 'price_level']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RestaurantDetailSerializer
        return RestaurantSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Restaurant.objects.filter(featured=True)[:6]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'featured', 'date']
    search_fields = ['name', 'description', 'venue']
    ordering_fields = ['date', 'name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Event.objects.filter(featured=True, date__gte=datetime.today())[:6]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        upcoming = Event.objects.filter(date__gte=datetime.today()).order_by('date')[:10]
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'for_sale', 'bedrooms', 'bathrooms', 'featured']
    search_fields = ['title', 'description', 'address']
    ordering_fields = ['price', 'bedrooms', 'size']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PropertyDetailSerializer
        return PropertySerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Property.objects.filter(featured=True)[:6]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

class TransportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportOption.objects.all()
    serializer_class = TransportOptionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['transport_type']
    search_fields = ['name', 'description']

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['content_type', 'content_id']

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
