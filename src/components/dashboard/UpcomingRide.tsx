
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, User, MessageCircle, Navigation, MapPin, Clock } from "lucide-react";
import RoutePreview from "../RoutePreview";

interface RideProps {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  driver: string;
  vehicle: string;
  vehicleColor: string;
  licensePlate: string;
  pickup: string;
  status: string;
}

const UpcomingRide = ({ ride }: { ride: RideProps }) => {
  const [driverLocation, setDriverLocation] = useState("5 mins away");
  const [estimatedArrival, setEstimatedArrival] = useState("8:55 AM");
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Simulate real-time driver tracking
    const interval = setInterval(() => {
      const distances = ["2 mins away", "3 mins away", "5 mins away", "At pickup point"];
      const times = ["8:53 AM", "8:55 AM", "8:57 AM", "9:00 AM"];
      
      setDriverLocation(distances[Math.floor(Math.random() * distances.length)]);
      setEstimatedArrival(times[Math.floor(Math.random() * times.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!ride) return null;
  
  return (
    <Card className="border-black border-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Upcoming Ride</CardTitle>
          <div className="flex items-center space-x-2">
            {isTracking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </Badge>
          </div>
        </div>
        <CardDescription>
          {ride.date}, {ride.time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Route Preview with Map */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <RoutePreview 
              from={ride.from} 
              to={ride.to} 
              fromType="state" 
              toType="university" 
            />
          </div>

          {/* Real-time driver info */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-900">Driver Status</h4>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-blue-700">Live</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">{driverLocation}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span className="text-sm font-medium">ETA: {estimatedArrival}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="min-w-[24px] mr-4 flex flex-col items-center">
              <div className="h-3 w-3 bg-black rounded-full"></div>
              <div className="h-12 border-l border-dashed border-gray-300"></div>
              <div className="h-3 w-3 bg-black rounded-full"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-medium">{ride.from}</p>
                <p className="text-xs text-gray-500">{ride.pickup}</p>
              </div>
              <div>
                <p className="font-medium">{ride.to}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center">
              <Car className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm">{ride.vehicle}, {ride.vehicleColor}</p>
                <p className="text-xs text-gray-500">{ride.licensePlate}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3 text-gray-500" />
              <p className="text-sm">{ride.driver}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Driver
            </Button>
            <Button 
              className={`${isTracking ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-neutral-800'} text-white`}
              onClick={() => setIsTracking(!isTracking)}
            >
              <Navigation className="mr-2 h-4 w-4" />
              {isTracking ? 'Stop Tracking' : 'Track Ride'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingRide;
