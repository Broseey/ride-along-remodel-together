
import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RideHistoryProps {
  id: string;
  from: string;
  to: string;
  date: string;
  price: string;
  status: string;
}

const RecentRides = ({ rides }: { rides: RideHistoryProps[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Rides</CardTitle>
        <CardDescription>Your past campus journeys</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {rides.map((ride) => (
            <Link to={`/rides/${ride.id}`} key={ride.id}>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{ride.from} → {ride.to}</p>
                  <p className="text-xs text-gray-500">{ride.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{ride.price}</p>
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    {ride.status}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="p-4 text-center">
          <Link to="/my-rides">
            <Button variant="link" className="text-black hover:text-gray-700">
              View all rides
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRides;
