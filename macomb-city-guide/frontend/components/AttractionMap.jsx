"use client";

import { useEffect } from "react";
import { MapPin } from "lucide-react";

export default function AttractionMap({ latitude, longitude, title, address }) {
  useEffect(() => {
    // This is a placeholder for integrating an actual map like Google Maps or Mapbox
    // In a real implementation, you would initialize the map library here
    
    console.log(`Map should show location at: ${latitude}, ${longitude}`);
    
    // For demo purposes, let's create a simple representation
    const mapContainer = document.getElementById("map-container");
    
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="flex items-center justify-center h-full bg-muted/30">
          <div class="text-center p-6 rounded-lg bg-background shadow-lg max-w-md">
            <div class="flex justify-center mb-3">
              <div class="p-2 bg-primary/10 rounded-full">
                <div class="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
              </div>
            </div>
            <h3 class="font-bold">${title}</h3>
            <p class="text-sm text-muted-foreground mt-1">${address}</p>
            <p class="mt-3 text-sm">Coordinates: ${latitude}, ${longitude}</p>
            <div class="mt-4">
              <a href="https://maps.google.com/?q=${latitude},${longitude}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Open in Google Maps</a>
            </div>
          </div>
        </div>
      `;
    }
    
    // In production, this would be replaced with actual map initialization:
    // 
    // const map = new mapboxgl.Map({
    //   container: "map-container",
    //   style: "mapbox://styles/mapbox/streets-v11",
    //   center: [longitude, latitude],
    //   zoom: 14,
    // });
    // 
    // new mapboxgl.Marker()
    //   .setLngLat([longitude, latitude])
    //   .setPopup(new mapboxgl.Popup().setHTML(`<h3>${title}</h3><p>${address}</p>`))
    //   .addTo(map);
    
  }, [latitude, longitude, title, address]);
  
  return (
    <div id="map-container" className="w-full h-full">
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    </div>
  );
}

// Simple loading indicator
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <div className="mt-2 text-sm text-muted-foreground">Loading map...</div>
    </div>
  );
}