import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Car,
  MapPin,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RideManagement from "@/components/admin/RideManagement";
import RealTimeLocationManager from "@/components/admin/RealTimeLocationManager";
import CreateRide from "@/components/admin/CreateRide";
import PricingManagement from "@/components/admin/PricingManagement";
import UniversityStateManager from "@/components/admin/UniversityStateManager";
import AdminAvailableRides from "@/components/admin/AdminAvailableRides";
import AdminQuickRoutes from "@/components/admin/AdminQuickRoutes";
import VehicleManager from "@/components/admin/VehicleManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Helmet, HelmetProvider } from "react-helmet-async";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [ridesResponse, usersResponse, driversResponse, partnersResponse] =
        await Promise.all([
          supabase.from("rides").select("id, status", { count: "exact" }),
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase.from("driver_profiles").select("id", { count: "exact" }),
          supabase.from("ride_companies").select("id", { count: "exact" }),
        ]);

      return {
        totalRides: ridesResponse.count || 0,
        totalUsers: usersResponse.count || 0,
        totalDrivers: driversResponse.count || 0,
        totalPartners: partnersResponse.count || 0,
        activeRides:
          ridesResponse.data?.filter(
            (ride) =>
              ride.status === "confirmed" ||
              ride.status === "pending" ||
              ride.status === "available"
          ).length || 0,
      };
    },
  });

  // Fetch partnership applications
  const { data: partnerApplications } = useQuery({
    queryKey: ["partner-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ride_companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Admin Dashboard | Uniride</title>
          <meta
            name="description"
            content="Admin dashboard for Uniride. Manage rides, users, and platform settings securely."
          />
        </Helmet>

        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your Uniride platform</p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rides">All Rides</TabsTrigger>
              <TabsTrigger value="available-rides">Available Rides</TabsTrigger>
              <TabsTrigger value="create-ride">Create Ride</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="quick-routes">Quick Routes</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.totalUsers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registered students
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Rides
                    </CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.totalRides || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All time bookings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Rides
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.activeRides || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Partners
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.totalPartners || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Company partners
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab("create-ride")}
                      className="p-4 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-left"
                    >
                      <Car className="h-6 w-6 mb-2" />
                      <h3 className="font-medium">Create New Ride</h3>
                      <p className="text-sm opacity-80">
                        Add available ride for users
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("locations")}
                      className="p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                    >
                      <MapPin className="h-6 w-6 mb-2" />
                      <h3 className="font-medium">Manage Locations</h3>
                      <p className="text-sm text-gray-500">
                        Universities & states
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("partners")}
                      className="p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                    >
                      <Users className="h-6 w-6 mb-2" />
                      <h3 className="font-medium">Partner Applications</h3>
                      <p className="text-sm text-gray-500">
                        Review partnerships
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("quick-routes")}
                      className="p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      <h3 className="font-medium">Manage Quick Routes</h3>
                      <p className="text-sm text-gray-500">
                        Admin quick route shortcuts
                      </p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rides">
              <RideManagement />
            </TabsContent>

            <TabsContent value="available-rides">
              <AdminAvailableRides />
            </TabsContent>

            <TabsContent value="create-ride">
              <CreateRide />
            </TabsContent>

            <TabsContent value="locations">
              <UniversityStateManager />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingManagement />
            </TabsContent>

            <TabsContent value="partners">
              <Card>
                <CardHeader>
                  <CardTitle>Partnership Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {!partnerApplications || partnerApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p>No partnership applications yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {partnerApplications.map((partner) => (
                        <div key={partner.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">
                              {partner.company_name}
                            </h3>
                            <Badge
                              variant={
                                partner.status === "pending"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {partner.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {partner.description}
                          </p>
                          <div className="text-sm text-gray-500">
                            <p>Email: {partner.contact_email}</p>
                            {partner.contact_phone && (
                              <p>Phone: {partner.contact_phone}</p>
                            )}
                            {partner.website_url && (
                              <p>Website: {partner.website_url}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quick-routes">
              <AdminQuickRoutes />
            </TabsContent>

            <TabsContent value="vehicles">
              <VehicleManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default AdminDashboard;
