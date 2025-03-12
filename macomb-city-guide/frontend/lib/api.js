import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Home page data
export const getHomePageData = (city = 'Macomb') => {
  return api.get(`/homepage/?city=${city}`);
};

// Attractions
export const getAttractions = (params = {}) => {
  return api.get('/attractions/', { params });
};

export const getAttraction = (id) => {
  return api.get(`/attractions/${id}/`);
};

export const getNearbyAttractions = (id) => {
  return api.get(`/attractions/${id}/nearby/`);
};

// Events
export const getEvents = (params = {}) => {
  return api.get('/events/', { params });
};

export const getEvent = (id) => {
  return api.get(`/events/${id}/`);
};

export const getEventTypes = () => {
  return api.get('/event-types/');
};

// Restaurants/Dining
export const getRestaurants = (params = {}) => {
  return api.get('/restaurants/', { params });
};

export const getRestaurant = (id) => {
  return api.get(`/restaurants/${id}/`);
};

export const getCuisines = () => {
  return api.get('/cuisines/');
};

// Real Estate
export const getProperties = (params = {}) => {
  return api.get('/properties/', { params });
};

export const getProperty = (id) => {
  return api.get(`/properties/${id}/`);
};

export const getPropertyTypes = () => {
  return api.get('/property-types/');
};

// Transportation
export const getTransportOptions = (params = {}) => {
  return api.get('/transport-options/', { params });
};

export const getTransportOption = (id) => {
  return api.get(`/transport-options/${id}/`);
};

export const getTransportTypes = () => {
  return api.get('/transport-types/');
};

// User-related endpoints (requires authentication)
export const getReviews = (params = {}) => {
  return api.get('/reviews/', { params });
};

export const postReview = (data) => {
  return api.post('/reviews/', data);
};

export const getRSVPs = (params = {}) => {
  return api.get('/rsvps/', { params });
};

export const toggleRSVP = (eventId) => {
  return api.post('/rsvps/', { event: eventId });
};

export const getSavedItems = () => {
  return api.get('/saved-items/');
};

export const toggleSavedItem = (itemType, itemId) => {
  return api.post('/saved-items/', { item_type: itemType, item_id: itemId });
};

// Search across all content
export const searchAll = (query) => {
  return api.get('/search/', { params: { q: query } });
};

// City information
export const getCityOverview = (cityName = 'Macomb') => {
  return api.get(`/cities/${cityName}/overview/`);
};

export default api;