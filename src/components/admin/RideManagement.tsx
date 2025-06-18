
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Users, Calendar, Clock, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProfileData {
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
}

interface RideWithProfile {
  id: string;
  user_id: string;
  from_location: string;
  to_location: string;
  departure_date: string;
  departure_time: string;
  total_seats: number;
  available_seats: number;
  price: number;
  status: string;
  booking_type: string;
  pickup_location?: string;
  description?: string;
  vehicle_type?: string;
  created_at: string;
  profile?: ProfileData;
}

interface BookingWithProfile {
  id: string;
  user_id: string;
  ride_id: string;
  seats_booked: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
  profile?: ProfileData;
  ride?: {
    from_location: string;
    to_location: string;
    departure_date: string;
    departure_time: string;
  };
}

const RideManagement = () => {
  const { data: rides, isLoading } = useQuery({
    queryKey: ['admin-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          profiles!inner(full_name, email, phone_number)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching rides:', error);
        return [];
      }
      
      return (data || []).map(ride => ({
        ...ride,
        profile: Array.isArray(ride.profiles) ? ride.profiles[0] : ride.profiles
      })) as RideWithProfile[];
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
          profiles!inner(full_name, email, phone_number),
          rides!inner(from_location, to_location, departure_date, departure_time)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
      
      return (data || []).map(booking => ({
        ...booking,
        profile: Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles,
        ride: Array.isArray(booking.rides) ? booking.rides[0] : booking.rides
      })) as BookingWithProfile[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'available': return 'default';
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
          <CardTitle>All Rides ({rides?.length || 0})</CardTitle>
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
                          {ride.profile?.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-500">{ride.profile?.email || 'No email'}</p>
                        {ride.profile?.phone_number && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{ride.profile.phone_number}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={getStatusColor(ride.status)}>
                        {ride.status}
                      </Badge>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Ride Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">Driver/Creator</p>
                              <p className="text-sm text-gray-600">{ride.profile?.full_name || 'N/A'}</p>
                              <p className="text-sm text-gray-600">{ride.profile?.email || 'N/A'}</p>
                              {ride.profile?.phone_number && (
                                <p className="text-sm text-gray-600">{ride.profile.phone_number}</p>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Status</p>
                              <Badge variant={getStatusColor(ride.status)}>
                                {ride.status}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">Route</p>
                            <p className="text-sm text-gray-600">
                              {ride.from_location} to {ride.to_location}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="font-medium">Date & Time</p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(ride.departure_date), 'PPP')} at {ride.departure_time}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Seats</p>
                              <p className="text-sm text-gray-600">
                                {ride.available_seats}/{ride.total_seats} available
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Price</p>
                              <p className="text-sm text-gray-600">₦{ride.price || 'TBD'}</p>
                            </div>
                          </div>
                          {ride.pickup_location && (
                            <div>
                              <p className="font-medium">Pickup Location</p>
                              <p className="text-sm text-gray-600">{ride.pickup_location}</p>
                            </div>
                          )}
                          {ride.vehicle_type && (
                            <div>
                              <p className="font-medium">Vehicle Type</p>
                              <p className="text-sm text-gray-600">{ride.vehicle_type}</p>
                            </div>
                          )}
                          {ride.description && (
                            <div>
                              <p className="font-medium">Description</p>
                              <p className="text-sm text-gray-600">{ride.description}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
                        <p className="font-medium">{ride.available_seats}/{ride.total_seats} seats</p>
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
          <CardTitle>Current Bookings ({allBookings?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allBookings?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No bookings have been made yet.
              </div>
            ) : (
              allBookings?.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">
                          {booking.profile?.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-500">{booking.profile?.email || 'No email'}</p>
                        {booking.profile?.phone_number && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{booking.profile.phone_number}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="default">
                          {booking.booking_status}
                        </Badge>
                        <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{booking.total_amount}</p>
                      <p className="text-sm text-gray-500">{booking.seats_booked} seat(s)</p>
                    </div>
                  </div>
                  
                  {booking.ride && (
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Route:</span> {booking.ride.from_location} → {booking.ride.to_location}</p>
                      <p><span className="font-medium">Date:</span> {format(new Date(booking.ride.departure_date), 'MMM dd, yyyy')} at {booking.ride.departure_time}</p>
                      <p><span className="font-medium">Booked:</span> {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}</p>
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
