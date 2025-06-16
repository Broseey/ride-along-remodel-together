
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useBookings } from '@/hooks/useBookings';

const UserBookings = () => {
  const { userBookings, isLoadingBookings } = useBookings();

  if (isLoadingBookings) {
    return <div className="text-center">Loading your bookings...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Bookings</h2>
      
      {userBookings?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">You haven't made any bookings yet.</p>
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
                      <Badge variant={
                        booking.booking_status === 'confirmed' ? 'default' :
                        booking.booking_status === 'completed' ? 'secondary' : 'destructive'
                      }>
                        {booking.booking_status}
                      </Badge>
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
                        <Badge variant={
                          booking.payment_status === 'paid' ? 'default' :
                          booking.payment_status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <span>Booked on {format(new Date(booking.created_at), 'PPP')}</span>
                    </div>
                  </div>

                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ₦{booking.total_amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total paid</div>
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
