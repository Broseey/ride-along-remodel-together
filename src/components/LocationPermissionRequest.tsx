
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LocationPermissionRequestProps {
  onLocationGranted: (location: { lat: number; lng: number; address: string }) => void;
  onLocationDenied: () => void;
}

const LocationPermissionRequest: React.FC<LocationPermissionRequestProps> = ({
  onLocationGranted,
  onLocationDenied
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt');

  useEffect(() => {
    // Check current permission status
    if ('geolocation' in navigator && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
      });
    }
  }, []);

  const requestLocation = async () => {
    setIsRequesting(true);
    
    if (!('geolocation' in navigator)) {
      toast.error("Geolocation is not supported by this browser");
      onLocationDenied();
      setIsRequesting(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=YOUR_MAPBOX_TOKEN`
        );
        const data = await response.json();
        const address = data.features[0]?.place_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        onLocationGranted({
          lat: latitude,
          lng: longitude,
          address
        });
        
        toast.success("Location access granted");
      } catch (error) {
        // Fallback if geocoding fails
        onLocationGranted({
          lat: latitude,
          lng: longitude,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        });
        toast.success("Location access granted");
      }
    } catch (error: any) {
      console.error('Location error:', error);
      
      if (error.code === 1) {
        toast.error("Location access denied. Please enable location services to use this feature.");
      } else if (error.code === 2) {
        toast.error("Location unavailable. Please check your GPS settings.");
      } else if (error.code === 3) {
        toast.error("Location request timed out. Please try again.");
      } else {
        toast.error("Unable to get your location. Please try again.");
      }
      
      onLocationDenied();
    } finally {
      setIsRequesting(false);
    }
  };

  const skipLocation = () => {
    onLocationDenied();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <MapPin className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Share Your Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-gray-600">
          <p>
            To provide you with the best ride experience, we'd like to access your current location. 
            This helps us:
          </p>
          <ul className="mt-2 text-left space-y-1">
            <li>• Find the nearest pickup points</li>
            <li>• Calculate accurate travel times</li>
            <li>• Provide better route suggestions</li>
          </ul>
        </div>

        {permissionStatus === 'denied' && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-700">
              Location access was previously denied. You may need to enable it in your browser settings.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            onClick={requestLocation} 
            className="w-full"
            disabled={isRequesting}
          >
            {isRequesting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Getting Location...
              </span>
            ) : (
              <span className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Allow Location Access
              </span>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={skipLocation}
            className="w-full"
            disabled={isRequesting}
          >
            Skip for Now
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Your location data is only used to improve your ride experience and is not stored permanently.
        </p>
      </CardContent>
    </Card>
  );
};

export default LocationPermissionRequest;
