
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Clock, Users, Car, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { useAvailableRides } from "@/hooks/useAvailableRides";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AvailableRides = () => {
  const { availableRides, isLoading } = useAvailableRides();
  const { createBooking } = useBookings();
  const { userProfile } = useAuth();
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const handleBookRide = async () => {
    if (!selectedRide) return;
    
    if (!userProfile?.phone_number) {
      toast.error('Please update your profile with a phone number before booking rides');
      return;
    }

    if (seatsToBook < 1 || seatsToBook > selectedRide.available_seats) {
      toast.error(`Please select between 1 and ${selectedRide.available_seats} seats`);
      return;
    }

    const totalAmount = selectedRide.price * seatsToBook;

    try {
      await createBooking.mutateAsync({
        rideId: selectedRide.id,
        seatsBooked: seatsToBook,
        totalAmount: totalAmount,
      });
      
      setIsBookingDialogOpen(false);
      setSelectedRide(null);
      setSeatsToBook(1);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!availableRides || availableRides.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No rides available</h3>
          <p className="text-gray-600">
            There are currently no rides available for your selected route. 
            Try adjusting your search criteria or check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Rides ({availableRides.length})</h2>
      </div>

      {availableRides.map((ride) => (
        <Card key={ride.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Route and Driver Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-lg">
                    {ride.from_location} → {ride.to_location}
                  </span>
                  <Badge variant="secondary">
                    {ride.booking_type === 'admin_created' ? 'Official Ride' : 'User Ride'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(ride.departure_date), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{ride.departure_time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>{ride.vehicle_type || 'Standard'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{ride.available_seats}/{ride.total_seats} seats</span>
                  </div>
                </div>

                {/* Driver/Creator Info */}
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    {ride.booking_type === 'admin_created' ? 'Official Ride' : 'Organized by'}: {ride.profiles?.full_name || 'UniRide'}
                  </p>
                  {ride.profiles?.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      <span>{ride.profiles.email}</span>
                    </div>
                  )}
                </div>

                {ride.pickup_location && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Pickup: </span>
                    <span>{ride.pickup_location}</span>
                  </div>
                )}

                {ride.description && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Details: </span>
                    <span>{ride.description}</span>
                  </div>
                )}
              </div>

              {/* Price and Booking */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="text-center lg:text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₦{ride.price?.toLocaleString() || 'TBD'}
                  </div>
                  <div className="text-sm text-gray-500">per seat</div>
                </div>
                
                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setSelectedRide(ride)}
                      className="bg-black text-white hover:bg-gray-800"
                      disabled={ride.available_seats === 0}
                    >
                      {ride.available_seats === 0 ? 'Fully Booked' : 'Book Seats'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Your Ride</DialogTitle>
                    </DialogHeader>
                    {selectedRide && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">
                            {selectedRide.from_location} → {selectedRide.to_location}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {format(new Date(selectedRide.departure_date), 'PPP')} at {selectedRide.departure_time}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <Label htmlFor="seats">Number of Seats</Label>
                          <Input
                            id="seats"
                            type="number"
                            min="1"
                            max={selectedRide.available_seats}
                            value={seatsToBook}
                            onChange={(e) => setSeatsToBook(parseInt(e.target.value) || 1)}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Available: {selectedRide.available_seats} seats
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Amount:</span>
                          <span>₦{((selectedRide.price || 0) * seatsToBook).toLocaleString()}</span>
                        </div>
                        
                        <Button
                          onClick={handleBookRide}
                          className="w-full bg-black text-white hover:bg-gray-800"
                          disabled={createBooking.isPending}
                        >
                          {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvailableRides;
