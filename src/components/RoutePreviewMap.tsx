
import React, { useEffect, useState } from "react";
import MapTokenHandler from "./map/MapTokenHandler";
import MapContainer from "./map/MapContainer";
import RouteInfoDisplay from "./map/RouteInfoDisplay";
import { 
  getCoordinates, 
  calculateDistance, 
  estimateTravelTime, 
  formatDistance 
} from "../utils/coordinateUtils";

interface RoutePreviewMapProps {
  from: string;
  to: string;
  fromType: "university" | "state";
  toType: "university" | "state";
}

const RoutePreviewMap: React.FC<RoutePreviewMapProps> = ({ from, to, fromType, toType }) => {
  const [travelTime, setTravelTime] = useState('Calculating...');
  const [distance, setDistance] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const fromCoords = getCoordinates(from);
  const toCoords = getCoordinates(to);

  // Calculate distance and travel time
  useEffect(() => {
    const distanceKm = calculateDistance(fromCoords, toCoords);
    setDistance(formatDistance(distanceKm));
    setTravelTime(estimateTravelTime(distanceKm));
  }, [fromCoords, toCoords]);

  // Check for valid token on component mount
  useEffect(() => {
    // Try to use a default token first, if it fails, show input
    const defaultToken = 'pk.eyJ1IjoiYnJvc2VleSIsImEiOiJjbWJnN3R1YWgxZWtoMm1xbmR6bm11bWY5In0.gLsCXIOidwX7evIAUbhIqg';
    setMapboxToken(defaultToken);
  }, []);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    setShowTokenInput(false);
  };

  const handleMapError = () => {
    setShowTokenInput(true);
  };

  if (showTokenInput) {
    return (
      <div className="w-full">
        <MapTokenHandler onTokenSubmit={handleTokenSubmit} />
        <RouteInfoDisplay 
          from={from}
          to={to}
          distance={distance}
          travelTime={travelTime}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <MapContainer
        fromCoords={fromCoords}
        toCoords={toCoords}
        from={from}
        to={to}
        fromType={fromType}
        toType={toType}
        mapboxToken={mapboxToken}
        onError={handleMapError}
      />
      
      <RouteInfoDisplay 
        from={from}
        to={to}
        distance={distance}
        travelTime={travelTime}
      />
    </div>
  );
};

export default RoutePreviewMap;
