
import { Button } from "@/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Calendar, Users, Car } from "lucide-react";

interface BookingDetailsProps {
  bookingData: {
    from: string;
    to: string;
    date: string;
    time: string;
    passengers: number;
    vehicle: {
      name: string;
      capacity: number;
      price: number;
    };
    bookingType: 'join' | 'full';
  };
}

const BookingDetails = ({ bookingData }: BookingDetailsProps) => {
  const { from, to, date, time, passengers, vehicle, bookingType } = bookingData;
  
  // Calculate price based on booking type
  const totalPrice = bookingType === 'full' 
    ? vehicle.price 
    : Math.round(vehicle.price / vehicle.capacity) * passengers;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Route</p>
            <p className="font-medium">{from} → {to}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{date}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{time}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Passengers</p>
            <p className="font-medium">{passengers}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Car className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-medium">{vehicle.name} ({vehicle.capacity} seats)</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="h-5 w-5 text-gray-500 mr-3 mt-0.5">💳</div>
          <div>
            <p className="text-sm text-gray-500">Booking Type</p>
            <p className="font-medium">
              {bookingType === 'full' ? 'Full Vehicle' : 'Join Ride'}
            </p>
          </div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Ride fare</span>
          <span className="font-medium">₦{bookingType === 'full' ? vehicle.price.toLocaleString() : (Math.round(vehicle.price / vehicle.capacity) * passengers).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Booking fee</span>
          <span className="font-medium">₦500</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₦{(totalPrice + 500).toLocaleString()}</span>
        </div>
      </div>
      
      <Button className="w-full mt-6 bg-campusorange-700 hover:bg-campusorange-800 rounded-[3.5rem] md:rounded-[5.5rem]">
        Proceed to Payment
      </Button>
    </Card>
  );
};

export default BookingDetails;
