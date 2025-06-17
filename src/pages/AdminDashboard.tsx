
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Car, MapPin, DollarSign, TrendingUp, Activity, Eye } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import RideManagement from "@/components/admin/RideManagement";
import CreateRide from "@/components/admin/CreateRide";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [ridesResponse, usersResponse, bookingsResponse, requestsResponse] = await Promise.all([
        supabase.from('rides').select('id, status', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id, total_amount'),
        supabase.from('ride_requests').select('id, status', { count: 'exact' })
      ]);

      const totalRevenue = bookingsResponse.data?.reduce((sum, booking) => 
        sum + Number(booking.total_amount), 0) || 0;

      return {
        totalRides: ridesResponse.count || 0,
        totalUsers: usersResponse.count || 0,
        totalBookings: bookingsResponse.data?.length || 0,
        totalRevenue,
        pendingRequests: requestsResponse.data?.filter(req => req.status === 'pending').length || 0,
        activeRides: ridesResponse.data?.filter(ride => 
          ride.status === 'available' || ride.status === 'confirmed'
        ).length || 0
      };
    },
  });

  // Fetch recent ride requests for admin review
  const { data: rideRequests } = useQuery({
    queryKey: ['admin-ride-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ride_requests')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching ride requests:', error);
        throw error;
      }
      return data || [];
    },
  });

  const handleApproveRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('ride_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (!error) {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-ride-requests'] });
      toast.success('Request approved successfully');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('ride_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (!error) {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-ride-requests'] });
      toast.success('Request rejected');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your Uniride platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rides">Ride Management</TabsTrigger>
            <TabsTrigger value="create-ride">Create Ride</TabsTrigger>
            <TabsTrigger value="requests">Ride Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalRides || 0}</div>
                  <p className="text-xs text-muted-foreground">All time rides</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦{stats?.totalRevenue?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">Total bookings revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.pendingRequests || 0}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab("create-ride")}
                      className="w-full text-left p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Create New Ride</p>
                          <p className="text-sm opacity-80">Add a new ride for users to join</p>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("requests")}
                      className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Review Ride Requests</p>
                          <p className="text-sm text-gray-500">{stats?.pendingRequests || 0} pending</p>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("rides")}
                      className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Manage Rides</p>
                          <p className="text-sm text-gray-500">View all platform rides</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">{stats?.activeRides || 0} Active Rides</p>
                        <p className="text-gray-500">Currently available for booking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">{stats?.totalBookings || 0} Total Bookings</p>
                        <p className="text-gray-500">All time seat bookings</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">{stats?.pendingRequests || 0} Pending Requests</p>
                        <p className="text-gray-500">Ride requests awaiting review</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rides">
            <RideManagement />
          </TabsContent>

          <TabsContent value="create-ride">
            <CreateRide />
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Ride Requests</CardTitle>
                <p className="text-sm text-gray-600">Review and approve user ride requests</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rideRequests?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No pending ride requests at the moment.
                    </div>
                  ) : (
                    rideRequests?.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{request.profiles?.full_name || 'Unknown User'}</h3>
                            <p className="text-sm text-gray-500">{request.profiles?.email || 'No email'}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Route</p>
                            <p className="text-gray-600">{request.from_location || 'N/A'} → {request.to_location || 'N/A'}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium">Date & Time</p>
                            <p className="text-gray-600">
                              {request.preferred_date ? format(new Date(request.preferred_date), 'MMM dd, yyyy') : 'N/A'} 
                              {request.preferred_time ? ` at ${request.preferred_time}` : ''}
                            </p>
                          </div>
                          
                          <div>
                            <p className="font-medium">Seats Needed</p>
                            <p className="text-gray-600">{request.seats_needed || 1} passenger(s)</p>
                          </div>
                          
                          <div>
                            <p className="font-medium">Max Price</p>
                            <p className="text-gray-600">₦{request.max_price || 'No limit'}</p>
                          </div>
                        </div>
                        
                        {request.description && (
                          <div className="text-sm">
                            <span className="font-medium">Description: </span>
                            <span className="text-gray-600">{request.description}</span>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(request.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveTab("create-ride")}
                          >
                            Create Ride
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
