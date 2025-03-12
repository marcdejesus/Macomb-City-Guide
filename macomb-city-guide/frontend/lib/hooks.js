'use client';

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';

// Generic hook for data fetching with loading and error states
export function useFetch(fetcher, params = {}, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher(params);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [...dependencies]);

  return { data, loading, error };
}

// Home page data
export function useHomePageData(city) {
  return useFetch(api.getHomePageData, city, [city]);
}

// Attractions
export function useAttractions(params) {
  return useFetch(api.getAttractions, params, [JSON.stringify(params)]);
}

export function useAttraction(id) {
  return useFetch(api.getAttraction, id, [id]);
}

export function useNearbyAttractions(id) {
  return useFetch(api.getNearbyAttractions, id, [id]);
}

// Events
export function useEvents(params) {
  return useFetch(api.getEvents, params, [JSON.stringify(params)]);
}

// More hooks for other endpoints...