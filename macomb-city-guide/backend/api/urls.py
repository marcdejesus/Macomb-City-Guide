# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'attractions', AttractionViewSet)
router.register(r'restaurants', RestaurantViewSet)
router.register(r'events', EventViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'transportation', TransportOptionViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'cuisines', CuisineViewSet)
router.register(r'event-types', EventTypeViewSet)
router.register(r'property-types', PropertyTypeViewSet)
router.register(r'transport-types', TransportTypeViewSet)
router.register(r'users', UserViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'contact', ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', GlobalSearchView.as_view(), name='global-search'),
    path('auth/', include('rest_framework.urls')),
    path('scrape/', ScraperView.as_view(), name='scrape'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # JWT Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]