from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from core.models import *
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from itertools import chain
from django.db.models import Q
from django.core.management import call_command
from django.utils import timezone 

class AttractionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Attraction.objects.all().order_by('id')  # Proper ordering
    serializer_class = AttractionSerializer
    detail_serializer_class = AttractionDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'rating']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()

class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all().order_by('id')  # Proper ordering
    serializer_class = RestaurantSerializer
    detail_serializer_class = RestaurantDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cuisine', 'price_level', 'featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'rating', 'price_level']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by('date', 'time')
    serializer_class = EventSerializer
    detail_serializer_class = EventDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'featured', 'date']
    search_fields = ['name', 'description', 'venue']
    ordering_fields = ['date', 'name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    detail_serializer_class = PropertyDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['property_type', 'bedrooms', 'bathrooms', 'for_sale']
    search_fields = ['title', 'description', 'address']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Price range filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        return queryset

class TransportOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportOption.objects.all()
    serializer_class = TransportOptionSerializer
    detail_serializer_class = TransportOptionDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['transport_type']
    search_fields = ['name', 'description', 'routes']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CuisineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer

class EventTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer

class PropertyTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer

class TransportTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportType.objects.all()
    serializer_class = TransportTypeSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]  # Already uses strict authentication
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
        
    @action(detail=False, methods=['get'])
    def attractions(self, request):
        favorites = self.get_queryset().filter(content_type__model='attraction')
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def restaurants(self, request):
        favorites = self.get_queryset().filter(content_type__model='restaurant')
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def events(self, request):
        favorites = self.get_queryset().filter(content_type__model='event')
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def properties(self, request):
        favorites = self.get_queryset().filter(content_type__model='property')
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['content_type', 'object_id']
    
    def get_queryset(self):
        return Review.objects.all().order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Contact.objects.all().order_by('-created_at')
        elif self.request.user.is_authenticated:
            return Contact.objects.filter(user=self.request.user).order_by('-created_at')
        # Return empty queryset for anonymous users
        return Contact.objects.none()  
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class GlobalSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query or len(query) < 2:
            return Response({"error": "Search query must be at least 2 characters"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Search across multiple models
        attractions = Attraction.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )[:10]
        
        restaurants = Restaurant.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )[:10]
        
        events = Event.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        ).order_by('date')[:10]
        
        # Fix the syntax error in this query
        properties = Property.objects.filter(
            Q(title__icontains=query) | Q(description__icontains=query) | 
            Q(address__icontains=query)
        )[:10]
        
        transport = TransportOption.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )[:10]
        
        # Serialize the results
        attraction_data = AttractionSerializer(attractions, many=True).data
        restaurant_data = RestaurantSerializer(restaurants, many=True).data
        event_data = EventSerializer(events, many=True).data
        property_data = PropertySerializer(properties, many=True).data
        transport_data = TransportOptionSerializer(transport, many=True).data
        
        return Response({
            'attractions': attraction_data,
            'restaurants': restaurant_data,
            'events': event_data,
            'properties': property_data,
            'transportation': transport_data
        })

class ScraperView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        scraper_type = request.data.get('type', 'all')
        valid_types = ['attractions', 'restaurants', 'events', 'properties', 'transportation', 'all']
        
        if scraper_type not in valid_types:
            return Response({"error": f"Invalid scraper type. Choose from: {', '.join(valid_types)}"},
                           status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Run the scraper in background for production
            # For demo purposes, we'll run it synchronously
            call_command('scrapenow', type=scraper_type)
            return Response({"status": "success", "message": f"Started scraping for {scraper_type}"})
        except Exception as e:
            return Response({"status": "error", "message": str(e)},
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DashboardStatsView(APIView):
    permission_classes = [AllowAny]  # Allow public access
    
    def get(self, request):
        try:
            # Count various data points
            attraction_count = Attraction.objects.count()
            restaurant_count = Restaurant.objects.count()
            event_count = Event.objects.count()
            property_count = Property.objects.count()
            transport_count = TransportOption.objects.count()
            user_count = User.objects.count()
            
            # Get recent items
            recent_attractions = AttractionSerializer(Attraction.objects.order_by('-id')[:5], many=True).data
            recent_restaurants = RestaurantSerializer(Restaurant.objects.order_by('-id')[:5], many=True).data
            
            # Handle date filter safely
            recent_events = EventSerializer(
                Event.objects.filter(date__gte=timezone.now().date()).order_by('date')[:5], 
                many=True
            ).data
            
            # Handle contact permissions 
            if request.user.is_staff:
                recent_contacts = ContactSerializer(Contact.objects.order_by('-created_at')[:5], many=True).data
            else:
                recent_contacts = []
            
            return Response({
                'counts': {
                    'attractions': attraction_count,
                    'restaurants': restaurant_count,
                    'events': event_count,
                    'properties': property_count,
                    'transportation': transport_count,
                    'users': user_count,
                },
                'recent': {
                    'attractions': recent_attractions,
                    'restaurants': recent_restaurants,
                    'events': recent_events,
                    'contacts': recent_contacts,
                }
            })
        except Exception as e:
            return Response(
                {"error": f"Error fetching dashboard data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
