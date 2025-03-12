"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RestaurantMap({ latitude, longitude, title }) {
  const [loading, setLoading] = useState(true);
  
  // In a real app, this would be a map component like Google Maps or Leaflet
  // Here we're just showing a placeholder
  
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="text-center p-6">
        <p className="text-sm text-muted-foreground mb-2">Map location for {title}</p>
        <p className="text-xs text-muted-foreground mb-4">Coordinates: {latitude}, {longitude}</p>
        <Button variant="outline" size="sm">
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(title + ' ' + latitude + ',' + longitude)}`}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </Button>
      </div>
    </div>
  );
}