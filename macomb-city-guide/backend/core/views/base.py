# core/views/base.py
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from core.models import City, Category
from core.serializers import CitySerializer, CategorySerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['name', 'state']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'population']

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# core/views/attraction.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.models import Attraction
from core.serializers import AttractionSerializer, AttractionDetailSerializer
from .base import StandardResultsSetPagination

class AttractionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Attraction.objects.all()
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name', 'city__name', 'featured', 'price_level']
    search_fields = ['name', 'description', 'address']
    ordering_fields = ['name', 'rating', 'price_level']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AttractionDetailSerializer
        return AttractionSerializer

# Similar ViewSets for Event, Restaurant, Property, and TransportOption