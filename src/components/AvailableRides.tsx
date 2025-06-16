
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Car, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const AvailableRides = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch available rides from Supabase with real-time updates
  const { data: availableRides, isLoading, refetch } = useQuery({
    queryKey: ['available-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver_profiles(full_name, phone_number),
          ride_bookings(id, seats_booked)
        `)
        .eq('status', 'available')
        .gte('departure_date', new Date().toISOString().split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('available-rides-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ride_bookings'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleJoinRide = async (rideId: string, availableSeats: number) => {
    if (!user) {
      toast.error("Please sign in to book a ride");
      navigate('/signin');
      return;
    }

    if (availableSeats <= 0) {
      toast.error("No seats available for this ride");
      return;
    }

    try {
      // Navigate to booking form with pre-filled ride details
      const ride = availableRides?.find(r => r.id === rideId);
      if (ride) {
        navigate('/schedule', { 
          state: { 
            prefilledRide: {
              from: ride.from_location,
              to: ride.to_location,
              date: ride.departure_date,
              time: ride.departure_time,
              rideId: ride.id
            }
          } 
        });
      }
    } catch (error) {
      console.error('Error joining ride:', error);
      toast.error('Failed to join ride. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!availableRides || availableRides.length === 0) {
    return (
      <div className="w-full max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Available Rides</h3>
            <p className="text-gray-600 mb-6">
              There are currently no rides available. Check back later or create your own ride request.
            </p>
            <Button 
              onClick={() => navigate('/schedule')}
              className="bg-black text-white hover:bg-gray-800"
            >
              Schedule a Ride
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="grid gap-4">
        {availableRides.map((ride) => {
          // Calculate available seats
          const totalBookedSeats = ride.ride_bookings?.reduce((sum: number, booking: any) => 
            sum + (booking.seats_booked || 0), 0) || 0;
          const availableSeats = (ride.vehicle_capacity || 6) - totalBookedSeats;
          
          return (
            <Card key={ride.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Route Information */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-lg">
                        {ride.from_location} → {ride.to_location}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ride.departure_date).toLocaleDateString()}</span>
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
                        <span>{availableSeats} seats left</span>
                      </div>
                    </div>

                    {ride.driver_profiles && (
                      <div className="mt-3 text-sm text-gray-600">
                        Driver: {ride.driver_profiles.full_name}
                      </div>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="text-center lg:text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₦{(ride.price_per_seat || Math.round((ride.price || 5000) / 6)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per seat</div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleJoinRide(ride.id, availableSeats)}
                        disabled={availableSeats <= 0}
                        className="bg-black text-white hover:bg-gray-800 min-w-[120px]"
                      >
                        {availableSeats <= 0 ? 'Fully Booked' : 'Book Seat'}
                      </Button>
                      
                      <Badge 
                        variant={availableSeats > 2 ? "default" : availableSeats > 0 ? "secondary" : "destructive"}
                        className="text-center"
                      >
                        {availableSeats > 2 ? 'Available' : 
                         availableSeats > 0 ? 'Few Seats Left' : 'Full'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {availableRides.length > 0 && (
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/schedule')}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Can't find your route? Schedule a custom ride
          </Button>
        </div>
      )}
    </div>
  );
};

export default AvailableRides;
