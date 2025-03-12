from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'cities', views.CityViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'attractions', views.AttractionViewSet)
router.register(r'event-types', views.EventTypeViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'cuisines', views.CuisineViewSet)
router.register(r'restaurants', views.RestaurantViewSet)
router.register(r'property-types', views.PropertyTypeViewSet)
router.register(r'properties', views.PropertyViewSet)
router.register(r'transport-types', views.TransportTypeViewSet)
router.register(r'transport-options', views.TransportOptionViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'rsvps', views.RSVPViewSet)
router.register(r'saved-items', views.SavedItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('homepage/', views.homepage_data, name='homepage-data'),
    path('attractions/<int:pk>/nearby/', views.nearby_attractions, name='nearby-attractions'),
    path('search/', views.search_all, name='search-all'),
    path('cities/<str:city_name>/overview/', views.city_overview, name='city-overview'),
]