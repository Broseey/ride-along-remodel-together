
import React from "react";

interface RouteInfoDisplayProps {
  from: string;
  to: string;
  distance: string;
  travelTime: string;
}

const RouteInfoDisplay: React.FC<RouteInfoDisplayProps> = ({ 
  from, 
  to, 
  distance, 
  travelTime 
}) => {
  return (
    <div className="flex justify-between items-center text-xs text-gray-700 bg-gray-50 p-2 rounded-md">
      <div className="flex items-center">
        <span className="font-semibold">{from.split(',')[0]}</span>
        <span className="mx-2 text-campusorange-600">→</span>
        <span className="font-semibold">{to.split(',')[0]}</span>
      </div>
      <div className="text-right">
        <div className="font-medium">{distance}</div>
        <div className="text-gray-500">{travelTime}</div>
      </div>
    </div>
  );
};

export default RouteInfoDisplay;
