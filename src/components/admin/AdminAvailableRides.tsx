
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, Users, Car, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminAvailableRides = () => {
  const queryClient = useQueryClient();

  const { data: availableRides, isLoading } = useQuery({
    queryKey: ['admin-available-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          profiles!rides_user_id_fkey(full_name, email)
        `)
        .eq('status', 'available')
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const updateRideStatus = useMutation({
    mutationFn: async ({ rideId, status }: { rideId: string; status: string }) => {
      const { error } = await supabase
        .from('rides')
        .update({ status })
        .eq('id', rideId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-available-rides'] });
      toast.success('Ride status updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update ride status');
      console.error('Error updating ride status:', error);
    },
  });

  const handleStatusChange = (rideId: string, newStatus: string) => {
    updateRideStatus.mutate({ rideId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading available rides...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Available Rides ({availableRides?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!availableRides || availableRides.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p>No available rides yet. Create a new ride to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableRides.map((ride) => (
              <div key={ride.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="default">Available</Badge>
                    <div>
                      <h3 className="font-medium">{ride.from_location} → {ride.to_location}</h3>
                      <p className="text-sm text-gray-500">
                        Created by: {ride.profiles?.full_name || 'Admin'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(ride.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusChange(ride.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(ride.departure_date), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{ride.departure_time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{ride.seats_requested} seats</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₦{ride.price?.toLocaleString() || 'TBD'}</span>
                  </div>
                </div>
                
                {ride.pickup_location && (
                  <div className="text-sm">
                    <span className="font-medium">Pickup: </span>
                    <span className="text-gray-600">{ride.pickup_location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAvailableRides;
