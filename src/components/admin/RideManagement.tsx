
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Users, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const RideManagement = () => {
  const { data: rides, isLoading } = useQuery({
    queryKey: ['admin-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching rides:', error);
        throw error;
      }
      return data;
    },
  });

  // Fetch all bookings for admin monitoring
  const { data: allBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rides(*),
          profiles:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return <div>Loading rides...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rides?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No rides have been created yet.
              </div>
            ) : (
              rides?.map((ride) => (
                <div key={ride.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">
                          {ride.profiles?.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-500">{ride.profiles?.email}</p>
                      </div>
                      <Badge variant={getStatusColor(ride.status)}>
                        {ride.status}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">From: {ride.from_location}</p>
                        <p className="text-gray-500">To: {ride.to_location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{format(new Date(ride.departure_date), 'MMM dd, yyyy')}</p>
                        <p className="text-gray-500">{ride.departure_time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{ride.seats_requested} passenger(s)</p>
                        <p className="text-gray-500">{ride.booking_type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">₦{ride.price || 'TBD'}</p>
                        <p className="text-gray-500">Created {format(new Date(ride.created_at), 'MMM dd')}</p>
                      </div>
                    </div>
                  </div>
                  
                  {ride.pickup_location && (
                    <div className="text-sm">
                      <span className="font-medium">Pickup Location: </span>
                      <span className="text-gray-600">{ride.pickup_location}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allBookings?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No bookings have been made yet.
              </div>
            ) : (
              allBookings?.slice(0, 10).map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">
                          {booking.profiles?.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-500">{booking.profiles?.email}</p>
                      </div>
                      <Badge variant="default">
                        {booking.booking_status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{booking.total_amount}</p>
                      <p className="text-sm text-gray-500">{booking.seats_booked} seat(s)</p>
                    </div>
                  </div>
                  
                  {booking.rides && (
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Route:</span> {booking.rides.from_location} → {booking.rides.to_location}</p>
                      <p><span className="font-medium">Date:</span> {format(new Date(booking.rides.departure_date), 'MMM dd, yyyy')} at {booking.rides.departure_time}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideManagement;
