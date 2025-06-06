
import { useState, useEffect } from "react";
import { User, Star, Phone, MessageCircle, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DriverMatchProps {
  rideType: string;
  onReset: () => void;
}

const DriverMatch = ({ rideType, onReset }: DriverMatchProps) => {
  const [status, setStatus] = useState("searching");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("found");
    }, 3000);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, []);

  if (status === "searching") {
    return (
      <div className="text-center space-y-6">
        <div className="animate-pulse">
          <Car className="h-16 w-16 text-primary mx-auto mb-4" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Finding your driver</h2>
          <p className="text-muted-foreground">
            Matching you with the best {rideType} driver nearby
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Estimated match time: {countdown}s
          </p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(3 - countdown) * 33.33}%` }}
            ></div>
          </div>
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-green-600 mb-2">✓</div>
        <h2 className="text-xl font-semibold mb-2">Driver Found!</h2>
        <p className="text-muted-foreground">Your driver is on the way</p>
      </div>

      {/* Driver Info */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Alex Johnson</h3>
            <div className="flex items-center space-x-1 mb-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.9</span>
              <span className="text-sm text-muted-foreground">(127 trips)</span>
            </div>
            <p className="text-sm text-muted-foreground">Honda Civic • Blue • ABC 123</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </Card>

      {/* Arrival Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-900">Arriving in 3 minutes</p>
          <p className="text-sm text-blue-700">Driver is 0.5 miles away</p>
        </div>
      </div>

      {/* Live Tracking */}
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <div className="animate-pulse mb-2">
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Live tracking map</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Track your driver in real-time</p>
      </div>

      <Button onClick={onReset} variant="outline" className="w-full">
        Book Another Ride
      </Button>
    </div>
  );
};

export default DriverMatch;
