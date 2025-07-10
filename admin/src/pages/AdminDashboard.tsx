import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/components/ui/tabs";
import {
  Users,
  Car,
  MapPin,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import RideManagement from "@/components/admin/RideManagement";
import RealTimeLocationManager from "@/components/admin/RealTimeLocationManager";
import CreateRide from "@/components/admin/CreateRide";
import PricingManagement from "@/components/admin/PricingManagement";
import UniversityStateManager from "@/components/admin/UniversityStateManager";
import AdminAvailableRides from "@/components/admin/AdminAvailableRides";
import AdminQuickRoutes from "@/components/admin/AdminQuickRoutes";
import VehicleManager from "@/components/admin/VehicleManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@shared/integrations/supabase/client";
import { Badge } from "@shared/components/ui/badge";
import { Helmet, HelmetProvider } from "react-helmet-async";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch admin stats (using the new SQL view for ride counts)
  const { data: rideCounts } = useQuery({
    queryKey: ["admin-ride-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ride_status_counts")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch admin stats (users, drivers, partners)
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersResponse, driversResponse, partnersResponse] =
        await Promise.all([
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase.from("driver_profiles").select("id", { count: "exact" }),
          supabase.from("ride_companies").select("id", { count: "exact" }),
        ]);
      return {
        totalUsers: usersResponse.count || 0,
        totalDrivers: driversResponse.count || 0,
        totalPartners: partnersResponse.count || 0,
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

        <AdminNavbar />

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
            <div
              className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 transition-all duration-300"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d1d5db #f3f4f6",
              }}
            >
              <TabsList className="flex min-w-max w-full gap-2 md:grid md:grid-cols-9 rounded-lg bg-gray-100 p-1">
                <TabsTrigger
                  value="overview"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="rides"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  All Rides
                </TabsTrigger>
                <TabsTrigger
                  value="available-rides"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Available Rides
                </TabsTrigger>
                <TabsTrigger
                  value="create-ride"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Create Ride
                </TabsTrigger>
                <TabsTrigger
                  value="locations"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Locations
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="partners"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Partners
                </TabsTrigger>
                <TabsTrigger
                  value="quick-routes"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Quick Routes
                </TabsTrigger>
                <TabsTrigger
                  value="vehicles"
                  className="flex-1 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Vehicles
                </TabsTrigger>
              </TabsList>
            </div>

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
                      {rideCounts?.total || 0}
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
                      {rideCounts?.active || 0}
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

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed Rides
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {rideCounts?.completed ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All time completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Cancelled Rides
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {rideCounts?.cancelled ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All time cancelled
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

// Add this to the bottom of the file or in a global CSS file if not already present:
// ::-webkit-scrollbar { height: 6px; background: transparent; }
// ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
// .scrollbar-thin::-webkit-scrollbar { height: 6px; }
// .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; }
// .scrollbar-thin:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
// .scrollbar-thin::-webkit-scrollbar-thumb:window-inactive { background: transparent; }
