
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { toast } from 'sonner';

interface MapLocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
  initialLocation?: string;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onLocationSelect,
  onClose,
  initialLocation
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use a default Mapbox token for demonstration
    const mapboxToken = 'pk.eyJ1IjoiYnJvc2VleSIsImEiOiJjbWJnN3R1YWgxZWtoMm1xbmR6bm11bWY5In0.gLsCXIOidwX7evIAUbhIqg';

    // Dynamically import Mapbox GL
    import('mapbox-gl').then(mapboxgl => {
      // Set the access token on the default export
      (mapboxgl as any).accessToken = mapboxToken;

      map.current = new (mapboxgl as any).Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [3.3792, 6.5244], // Lagos, Nigeria
        zoom: 10
      });

      map.current.addControl(new (mapboxgl as any).NavigationControl());

      map.current.on('load', () => {
        setIsLoading(false);
      });

      // Add click handler to map
      map.current.on('click', async (e: any) => {
        const { lng, lat } = e.lngLat;

        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new (mapboxgl as any).Marker({ color: '#000000' })
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Get address from coordinates (reverse geocoding)
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
          );
          const data = await response.json();
          const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          setSelectedLocation({
            lat,
            lng,
            address
          });
        } catch (error) {
          console.error('Error getting address:', error);
          setSelectedLocation({
            lat,
            lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          });
        }
      });

      map.current.on('error', () => {
        toast.error('Failed to load map. Please check your internet connection.');
      });
    }).catch(() => {
      toast.error('Failed to load map components.');
      setIsLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    } else {
      toast.error('Please select a location on the map');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Location on Map</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                <p>Loading map...</p>
              </div>
            </div>
          )}
          <div ref={mapContainer} className="w-full h-full" />
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          {selectedLocation && (
            <div className="mb-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">Selected Location:</p>
                  <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Click anywhere on the map to select a location</p>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmLocation}
                disabled={!selectedLocation}
                className="bg-black text-white hover:bg-gray-800"
              >
                Confirm Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;
