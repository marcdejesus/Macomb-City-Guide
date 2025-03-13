"use client";

import { useState } from "react";
import { MapPin, ParkingSquare, Car, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransportMap({ mapType, locations, serviceInfo }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // In a real app, you would integrate with Google Maps, Mapbox, or another map provider
  // For this demo, we'll create a placeholder map interface
  
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'bus-stop':
        return <Bus className="h-4 w-4" />;
      case 'garage':
        return <ParkingSquare className="h-4 w-4" />;
      case 'surface-lot':
        return <ParkingSquare className="h-4 w-4" />;
      case 'taxi':
        return <Car className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const renderMapContent = () => {
    switch (mapType) {
      case "transitRoutes":
        return (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Macomb County Transit Map</h3>
            <div className="text-muted-foreground mb-6">
              This map shows the primary bus routes and stops throughout Macomb County.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {locations?.map((location, index) => (
                <Button 
                  key={index} 
                  variant={selectedLocation === location ? "default" : "outline"}
                  className="text-left justify-start h-auto py-2"
                  onClick={() => handleLocationSelect(location)}
                >
                  <Bus className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{location.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{location.address}</div>
                  </div>
                </Button>
              ))}
            </div>
            {selectedLocation && (
              <div className="mt-6 p-4 border rounded-md bg-background max-w-md mx-auto">
                <h4 className="font-medium mb-1">{selectedLocation.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{selectedLocation.address}</p>
                <Button size="sm" asChild>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedLocation.address)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </Button>
              </div>
            )}
          </div>
        );
        
      case "taxiServices":
        return (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">{serviceInfo.name} Service Area</h3>
            <div className="text-muted-foreground mb-6">
              Coverage: {serviceInfo.coverage}
            </div>
            <div className="rounded-lg border p-4 max-w-md mx-auto">
              <p className="mb-4">Need a ride? Call for immediate service:</p>
              <Button asChild>
                <a href={`tel:${serviceInfo.phone.replace(/[^0-9]/g, '')}`}>
                  {serviceInfo.phone}
                </a>
              </Button>
            </div>
          </div>
        );
        
      case "parkingLocations":
        return (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Macomb County Parking Locations</h3>
            <div className="text-muted-foreground mb-6">
              This map shows major parking facilities in Macomb County.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {locations?.map((location, index) => (
                <Button 
                  key={index} 
                  variant={selectedLocation === location ? "default" : "outline"}
                  className="text-left justify-start h-auto py-2"
                  onClick={() => handleLocationSelect(location)}
                >
                  <ParkingSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{location.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{location.address}</div>
                  </div>
                </Button>
              ))}
            </div>
            {selectedLocation && (
              <div className="mt-6 p-4 border rounded-md bg-background max-w-md mx-auto">
                <h4 className="font-medium mb-1">{selectedLocation.name}</h4>
                <p className="text-sm mb-1">{selectedLocation.type}</p>
                <p className="text-sm text-muted-foreground mb-1">{selectedLocation.address}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedLocation.spaces} spaces • {selectedLocation.rates}
                </p>
                <Button size="sm" asChild>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedLocation.address)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </Button>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Map display not available</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full bg-muted/30 rounded-lg">
      {renderMapContent()}
    </div>
  );
}