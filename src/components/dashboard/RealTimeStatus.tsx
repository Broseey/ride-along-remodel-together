
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Badge } from "@shared/components/ui/badge";
import { MapPin, Clock, Users, Zap } from "lucide-react";

const RealTimeStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeRides, setActiveRides] = useState(12);
  const [nearbyDrivers, setNearbyDrivers] = useState(8);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveRides(prev => prev + Math.floor(Math.random() * 3) - 1);
      setNearbyDrivers(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Live Status</CardTitle>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Online
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">Active Rides</span>
          </div>
          <span className="font-bold text-blue-600">{activeRides}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-orange-500" />
            <span className="text-sm">Nearby Drivers</span>
          </div>
          <span className="font-bold text-orange-600">{nearbyDrivers}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">Last Update</span>
          </div>
          <span className="text-xs text-gray-500">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-center text-xs text-green-600">
            <Zap className="h-3 w-3 mr-1" />
            Real-time updates active
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeStatus;
