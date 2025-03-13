'use client';

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';

// Generic hook for data fetching with loading and error states
export function useFetch(fetchFunction, params = {}, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction(params);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [...dependencies]);

  return { data, loading, error };
}

// Attractions hooks
export function useAttractions(params) {
  return useFetch(api.getAttractions, params, [JSON.stringify(params)]);
}

export function useAttraction(id) {
  return useFetch(api.getAttraction, id, [id]);
}

// Restaurants hooks
export function useRestaurants(params) {
  return useFetch(api.getRestaurants, params, [JSON.stringify(params)]);
}

export function useRestaurant(id) {
  return useFetch(api.getRestaurant, id, [id]);
}

// Events hooks
export function useEvents(params) {
  return useFetch(api.getEvents, params, [JSON.stringify(params)]);
}

export function useEvent(id) {
  return useFetch(api.getEvent, id, [id]);
}

// Add more hooks for other endpoints