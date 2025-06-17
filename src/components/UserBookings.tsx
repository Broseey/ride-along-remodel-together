
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Users, Receipt, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useBookings } from '@/hooks/useBookings';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const UserBookings = () => {
  const { userBookings, isLoadingBookings } = useBookings();

  if (isLoadingBookings) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-2">Loading your bookings...</span>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Bookings</h2>
        <div className="text-sm text-gray-600">
          Total: {userBookings?.length || 0} booking(s)
        </div>
      </div>
      
      {userBookings?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start by booking your first ride!</p>
            <Button className="bg-black text-white hover:bg-gray-800">
              Browse Available Rides
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userBookings?.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-lg">
                        {booking.rides.from_location} → {booking.rides.to_location}
                      </span>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(booking.booking_status)}>
                          {booking.booking_status}
                        </Badge>
                        <Badge variant={getPaymentStatusColor(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(booking.rides.departure_date), 'MMM dd, yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.rides.departure_time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{booking.seats_booked} seat(s) booked</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Ref: {booking.payment_reference?.slice(-8) || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <span>Booked on {format(new Date(booking.created_at), 'PPP')}</span>
                    </div>

                    {booking.rides.pickup_location && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Pickup: </span>
                        {booking.rides.pickup_location}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-center lg:text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₦{booking.total_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total paid</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Receipt className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">Booking ID</p>
                                <p className="text-sm text-gray-600">{booking.id}</p>
                              </div>
                              <div>
                                <p className="font-medium">Payment Reference</p>
                                <p className="text-sm text-gray-600">{booking.payment_reference || 'N/A'}</p>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Route</p>
                              <p className="text-sm text-gray-600">
                                {booking.rides.from_location} to {booking.rides.to_location}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">Departure</p>
                                <p className="text-sm text-gray-600">
                                  {format(new Date(booking.rides.departure_date), 'PPP')} at {booking.rides.departure_time}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium">Seats</p>
                                <p className="text-sm text-gray-600">{booking.seats_booked} passenger(s)</p>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Total Amount</p>
                              <p className="text-xl font-bold text-green-600">₦{booking.total_amount.toLocaleString()}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
