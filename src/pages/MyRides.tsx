
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Calendar, Clock, Users, Car, CalendarPlus, Receipt, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import RideReceipt from "@/components/RideReceipt";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const MyRides = () => {
  const { user } = useAuth();
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Fetch user's rides with real-time updates
  const { data: rides, isLoading, refetch } = useQuery({
    queryKey: ['user-rides', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-rides-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  // Separate rides by status
  const upcomingRides = rides?.filter(ride => 
    ride.status === 'confirmed' || ride.status === 'pending'
  ) || [];
  
  const pastRides = rides?.filter(ride => 
    ride.status === 'completed' || ride.status === 'cancelled'
  ) || [];

  const handleViewReceipt = (ride: any) => {
    setSelectedRide(ride);
    setShowReceipt(true);
  };

  const RideCard = ({ ride, showReceiptButton = false }: { ride: any; showReceiptButton?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Route Information */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-lg">
                {ride.from_location} → {ride.to_location}
              </span>
              <Badge variant={
                ride.status === 'completed' ? 'default' : 
                ride.status === 'confirmed' ? 'secondary' : 
                ride.status === 'cancelled' ? 'destructive' : 'outline'
              }>
                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </Badge>
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
                <span>{ride.booking_type === 'full' ? 'Full Ride' : 'Seat Booking'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{ride.seats_requested} {ride.seats_requested === 1 ? 'seat' : 'seats'}</span>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <span>Booked on {format(new Date(ride.created_at), 'PPP')}</span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="text-center lg:text-right">
              <div className="text-2xl font-bold text-green-600">
                ₦{ride.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total paid</div>
            </div>
            
            {showReceiptButton && ride.status === 'completed' && (
              <Button
                onClick={() => handleViewReceipt(ride)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                View Receipt
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ title, description, actionText, actionLink }: {
    title: string;
    description: string;
    actionText: string;
    actionLink: string;
  }) => (
    <Card className="text-center py-12">
      <CardContent>
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link to={actionLink}>
          <Button className="bg-black text-white hover:bg-gray-800">
            <CalendarPlus className="mr-2 h-4 w-4" />
            {actionText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
          <p className="text-gray-600 mt-2">Track your ride history and upcoming trips</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">
              Upcoming Rides ({upcomingRides.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Rides ({pastRides.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingRides.length > 0 ? (
              <div className="space-y-4">
                {upcomingRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Upcoming Rides"
                description="You don't have any upcoming rides scheduled. Book your next trip to get started!"
                actionText="Book a Ride"
                actionLink="/"
              />
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastRides.length > 0 ? (
              <div className="space-y-4">
                {pastRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} showReceiptButton />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Past Rides"
                description="You haven't completed any rides yet. Your ride history will appear here after your first trip."
                actionText="Book Your First Ride"
                actionLink="/"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ride Receipt</DialogTitle>
          </DialogHeader>
          {selectedRide && <RideReceipt ride={selectedRide} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyRides;
