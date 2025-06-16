
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import RideBookingFormNew from "@/components/RideBookingFormNew";
import { Link } from "react-router-dom";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  const timeSlots = [
    "06:00", "08:00", "10:00", "12:00", 
    "14:00", "16:00", "18:00", "20:00"
  ];

  const popularRoutes = [
    { from: "Lagos", to: "University of Ibadan", price: "₦1,200" },
    { from: "Abuja", to: "Ahmadu Bello University", price: "₦1,500" },
    { from: "Port Harcourt", to: "University of Port Harcourt", price: "₦800" },
    { from: "Lagos", to: "University of Lagos", price: "₦1,000" }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Schedule a Ride</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <RideBookingFormNew />
          </div>
          
          <div className="md:w-1/2">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>
                  Frequently traveled routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularRoutes.map((route, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 mt-1 text-gray-500" />
                        <div>
                          <p className="font-medium">{route.from} → {route.to}</p>
                          <p className="text-sm text-gray-500">Starting from {route.price}</p>
                        </div>
                      </div>
                      <Link to="/signin">
                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-neutral-800 transform active:scale-95 transition-transform duration-200"
                        >
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
