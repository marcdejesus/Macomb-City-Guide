import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiClient = {
  // Authentication
  auth: {
    login: (credentials) => api.post('/token/', credentials),
    register: (userData) => api.post('/users/register/', userData),
    refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  },
  
  // Attractions
  attractions: {
    getAll: (params) => api.get('/attractions/', { params }),
    getById: (id) => api.get(`/attractions/${id}/`),
    getFeatured: () => api.get('/attractions/?featured=true'),
  },
  
  // Restaurants
  restaurants: {
    getAll: (params) => api.get('/restaurants/', { params }),
    getById: (id) => api.get(`/restaurants/${id}/`),
    getFeatured: () => api.get('/restaurants/?featured=true'),
  },
  
  // Events
  events: {
    getAll: (params) => api.get('/events/', { params }),
    getById: (id) => api.get(`/events/${id}/`),
    getUpcoming: () => api.get('/events/?date_gte=today'),
    getFeatured: () => api.get('/events/?featured=true'),
  },
  
  // Properties
  properties: {
    getAll: (params) => api.get('/properties/', { params }),
    getById: (id) => api.get(`/properties/${id}/`),
  },
  
  // Search
  search: (query) => api.get(`/search/?q=${query}`),
  
  // Testing connection
  testConnection: () => api.get('/schema/'),
};

export default apiClient;