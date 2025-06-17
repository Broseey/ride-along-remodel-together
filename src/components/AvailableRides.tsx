
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
import { useAuth } from '@/contexts/AuthContext';
import PaystackPayment from './PaystackPayment';
import { toast } from 'sonner';

const AvailableRides = () => {
  const { availableRides, isLoading } = useAvailableRides();
  const { createBooking } = useBookings();
  const { userProfile } = useAuth();
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-2">Loading available rides...</span>
      </div>
    );
  }

  const handleBookRide = (ride: any) => {
    if (!userProfile) {
      toast.error('Please log in to book a ride');
      return;
    }
    setSelectedRide(ride);
    setSeatsToBook(1);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    setShowBookingDialog(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment successful with reference:', reference);
    createBooking.mutate({
      rideId: selectedRide.id,
      seatsBooked: seatsToBook,
      totalAmount: selectedRide.price * seatsToBook,
      paymentReference: reference,
    });
    setShowPayment(false);
    setSelectedRide(null);
    setSeatsToBook(1);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  const handleDirectBooking = (ride: any) => {
    if (!userProfile) {
      toast.error('Please log in to book a ride');
      return;
    }
    
    console.log('Creating direct booking for ride:', ride.id);
    createBooking.mutate({
      rideId: ride.id,
      seatsBooked: 1,
      totalAmount: ride.price,
    });
  };

  return (
    <div className="space-y-4">
      {availableRides?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rides available</h3>
            <p className="text-gray-600">Check back later for new rides or request a custom route.</p>
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

                    {ride.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Details: </span>
                        {ride.description}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-center lg:text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₦{ride.price?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per seat</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDirectBooking(ride)}
                        variant="outline"
                        disabled={ride.available_seats === 0 || createBooking.isPending}
                        className="flex-1"
                      >
                        {createBooking.isPending ? 'Booking...' : 'Quick Book'}
                      </Button>
                      <Button
                        onClick={() => handleBookRide(ride)}
                        className="bg-black text-white hover:bg-gray-800 flex-1"
                        disabled={ride.available_seats === 0}
                      >
                        {ride.available_seats === 0 ? 'Fully Booked' : 'Book with Payment'}
                      </Button>
                    </div>
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
          
          {selectedRide && userProfile && (
            <PaystackPayment
              email={userProfile.email || 'user@example.com'}
              amount={selectedRide.price * seatsToBook}
              reference={`booking_${Date.now()}`}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
              rideDetails={{
                from: selectedRide.from_location,
                to: selectedRide.to_location,
                date: format(new Date(selectedRide.departure_date), 'PPP'),
                time: selectedRide.departure_time,
                passengers: seatsToBook
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableRides;
