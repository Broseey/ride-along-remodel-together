
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, Clock, Car } from "lucide-react";
import { useAvailableRides } from "@/hooks/useAvailableRides";
import { format } from "date-fns";

interface RouteProps {
  from: string;
  to: string;
  price: string;
}

const QuickRoutes = ({ routes }: { routes: RouteProps[] }) => {
  const { availableRides } = useAvailableRides();

  // Find actual rides for quick routes
  const getAvailableRideForRoute = (from: string, to: string) => {
    return availableRides?.find(ride => 
      ride.from_location.toLowerCase().includes(from.toLowerCase()) &&
      ride.to_location.toLowerCase().includes(to.toLowerCase()) &&
      ride.available_seats > 0
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {routes.map((route, index) => {
          const availableRide = getAvailableRideForRoute(route.from, route.to);
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{route.from} → {route.to}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Starting from {route.price}</span>
                        {availableRide && (
                          <>
                            <Badge variant="secondary">
                              {availableRide.available_seats} seats available
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(availableRide.departure_date), 'MMM dd')}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {availableRide ? (
                      <div className="text-right mr-2">
                        <div className="font-bold text-green-600">
                          ₦{availableRide.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Available now</div>
                      </div>
                    ) : (
                      <div className="text-right mr-2">
                        <div className="text-sm text-gray-500">No rides available</div>
                        <div className="text-xs text-gray-400">Request this route</div>
                      </div>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Can't find your route?</CardTitle>
          <CardDescription>
            Request a custom route and we'll try to arrange it for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <MapPin className="h-4 w-4 mr-2" />
            Request Custom Route
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickRoutes;
