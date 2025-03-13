from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from api.views import EventTypeViewSet

router = DefaultRouter()
router.register(r'cities', views.CityViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'attractions', views.AttractionViewSet)
router.register(r'event-types', EventTypeViewSet)
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
    path('transport-schedules/', views.transport_schedules, name='transport-schedules'),
    path('transport-routes/', views.transport_routes, name='transport-routes'),
    path('parking-locations/', views.parking_locations, name='parking-locations'),
    path('featured-restaurants/', views.featured_restaurants, name='featured-restaurants'),
    path('restaurant-categories/', views.restaurant_categories, name='restaurant-categories'),
    path('nearby-restaurants/<int:restaurant_id>/', views.nearby_restaurants, name='nearby-restaurants'),
    path('advanced-search/<str:category>/', views.advanced_search, name='advanced-search'),
    path('user/favorites/', views.user_favorites, name='user-favorites'),
    path('user/reviews/', views.user_reviews, name='user-reviews'),
    path('user/rsvps/', views.user_rsvps, name='user-rsvps'),
]