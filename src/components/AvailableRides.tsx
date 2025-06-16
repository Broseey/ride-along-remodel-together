
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Clock, Users, Car } from 'lucide-react';
import { format } from 'date-fns';
import { useAvailableRides } from '@/hooks/useAvailableRides';
import { useBookings } from '@/hooks/useBookings';
import PaystackPayment from './PaystackPayment';

const AvailableRides = () => {
  const { availableRides, isLoading } = useAvailableRides();
  const { createBooking } = useBookings();
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  if (isLoading) {
    return <div className="text-center">Loading available rides...</div>;
  }

  const handleBookRide = (ride: any) => {
    setSelectedRide(ride);
    setSeatsToBook(1);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    setShowBookingDialog(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (reference: string) => {
    createBooking.mutate({
      rideId: selectedRide.id,
      seatsBooked: seatsToBook,
      totalAmount: selectedRide.price * seatsToBook,
    });
    setShowPayment(false);
    setSelectedRide(null);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Available Rides</h2>
      
      {availableRides?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No rides available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {availableRides?.map((ride) => (
            <Card key={ride.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-lg">
                        {ride.from_location} → {ride.to_location}
                      </span>
                      <Badge variant="secondary">{ride.available_seats} seats left</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
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
                        <span>{ride.total_seats} total seats</span>
                      </div>
                    </div>

                    {ride.pickup_location && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Pickup: </span>
                        {ride.pickup_location}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-center lg:text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₦{ride.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per seat</div>
                    </div>
                    
                    <Button
                      onClick={() => handleBookRide(ride)}
                      className="bg-black text-white hover:bg-gray-800"
                      disabled={ride.available_seats === 0}
                    >
                      {ride.available_seats === 0 ? 'Fully Booked' : 'Book Ride'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
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
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRide.available_seats} seats available
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Total Amount:</span>
                  <span className="text-xl font-bold">
                    ₦{(selectedRide.price * seatsToBook).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleConfirmBooking}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Proceed to Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          
          {selectedRide && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold">
                  ₦{(selectedRide.price * seatsToBook).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  for {seatsToBook} seat(s)
                </p>
              </div>
              
              <PaystackPayment
                email="user@example.com" // This should come from user profile
                amount={selectedRide.price * seatsToBook}
                reference={`booking_${Date.now()}`}
                onSuccess={handlePaymentSuccess}
                onClose={handlePaymentClose}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableRides;
