'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export function Map({ 
  latitude, 
  longitude, 
  address = "",  
  zoom = 15,
  height = "300px",
  className = "" 
}) {
  const mapRef = useRef(null);
  
  useEffect(() => {
    // Check if the map should render
    if (!latitude || !longitude) return;
    
    // This would typically use a map library like Google Maps, Leaflet, or Mapbox
    // For now, we'll render a placeholder with the coordinates
    
    if (mapRef.current) {
      const mapContainer = mapRef.current;
      
      // This would be replaced with actual map initialization code
      mapContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full bg-muted/50 rounded-md p-4">
          <div class="text-center">
            <div class="font-medium">Location Map</div>
            <div class="text-sm text-muted-foreground">Latitude: ${latitude}</div>
            <div class="text-sm text-muted-foreground">Longitude: ${longitude}</div>
            ${address ? `<div class="text-sm mt-2">${address}</div>` : ''}
          </div>
        </div>
      `;
    }
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Cleanup map instance if needed
      }
    };
  }, [latitude, longitude, address, zoom]);
  
  return (
    <div 
      ref={mapRef}
      className={`w-full rounded-md overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}

export function MapPin({ address }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{address}</span>
    </div>
  );
}