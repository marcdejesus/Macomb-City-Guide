'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

export function useApi(apiFn, params = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiFn(params);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

// Specialized hooks
export function useAttractions(params) {
  return useApi(apiClient.attractions.getAll, params, [JSON.stringify(params)]);
}

export function useAttraction(id) {
  return useApi(apiClient.attractions.getById, id, [id]);
}

export function useRestaurants(params) {
  return useApi(apiClient.restaurants.getAll, params, [JSON.stringify(params)]);
}

export function useEvents(params) {
  return useApi(apiClient.events.getAll, params, [JSON.stringify(params)]);
}

// Add more specialized hooks as needed