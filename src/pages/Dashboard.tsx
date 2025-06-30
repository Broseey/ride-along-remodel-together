import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import UpcomingRide from "@/components/dashboard/UpcomingRide";
import QuickRoutes from "@/components/dashboard/QuickRoutes";
import RecentRides from "@/components/dashboard/RecentRides";
import AccountLinks from "@/components/dashboard/AccountLinks";
import RealTimeStatus from "@/components/dashboard/RealTimeStatus";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import Footer from "@/components/dashboard/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/hooks/useRides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarPlus, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const isMobile = useIsMobile();
  const { userProfile } = useAuth();
  const { rides, isLoading, refetch } = useRides();

  const userName = userProfile?.full_name?.split(" ")[0] || "User";

  // Set up real-time subscription for user's rides
  useEffect(() => {
    const channel = supabase
      .channel("user-rides-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
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

  // Separate upcoming and past rides
  const upcomingRides =
    rides?.filter(
      (ride) => ride.status === "confirmed" || ride.status === "pending"
    ) || [];

  const pastRides = rides?.filter((ride) => ride.status === "completed") || [];

  // DEBUG: Show user, userProfile, and rides for troubleshooting
  // Remove or comment out in production
  console.log("Dashboard DEBUG:", {
    userProfile,
    rides,
  });

  // Map Supabase rides to UpcomingRide and RecentRides prop shape
  const mapToUpcomingRide = (ride) => ({
    id: ride.id,
    from: ride.from_location,
    to: ride.to_location,
    date: ride.departure_date,
    time: ride.departure_time,
    driver: ride.driver_name || "TBD",
    vehicle: ride.vehicle_type || "TBD",
    vehicleColor: ride.vehicle_color || "",
    licensePlate: ride.license_plate || "",
    pickup: ride.pickup_location || "",
    status: ride.status,
  });

  const mapToRecentRide = (ride) => ({
    id: ride.id,
    from: ride.from_location,
    to: ride.to_location,
    date: ride.departure_date,
    price: ride.price ? `₦${ride.price.toLocaleString()}` : "N/A",
    status: ride.status.charAt(0).toUpperCase() + ride.status.slice(1),
  });

  const nextUpcomingRide = upcomingRides[0]
    ? mapToUpcomingRide(upcomingRides[0])
    : null;
  const recentRides = pastRides.map(mapToRecentRide);

  // Quick routes suggestions
  const quickRoutes = [
    {
      from: "Lagos",
      to: "University of Ibadan",
      price: "₦1,200",
    },
    {
      from: "Abuja",
      to: "Ahmadu Bello University",
      price: "₦1,500",
    },
    {
      from: "Port Harcourt",
      to: "University of Port Harcourt",
      price: "₦800",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <WelcomeHeader name={userName} />

        {/* Trip Status Overview - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rides?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Rides
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingRides.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main actions and upcoming ride */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />

            {/* Upcoming Ride or No Rides Message */}
            {nextUpcomingRide ? (
              <UpcomingRide ride={nextUpcomingRide} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">No Upcoming Rides</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600 mb-6">
                    You don't have any upcoming rides scheduled.
                  </p>
                  <Link to="/schedule">
                    <Button className="bg-black text-white hover:bg-neutral-800">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Schedule a Ride
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <QuickRoutes routes={quickRoutes} />
          </div>

          {/* Right column - Account and recent activity */}
          <div className="space-y-6">
            <AccountLinks />

            {/* Recent Rides or No Rides Message */}
            {recentRides.length > 0 ? (
              <RecentRides rides={recentRides.slice(0, 3)} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Rides</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-6">
                  <p className="text-gray-600 text-sm">
                    No ride history yet. Book your first ride to get started!
                  </p>
                  <Link to="/">
                    <Button className="mt-4 bg-black text-white hover:bg-neutral-800">
                      Book a Ride
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <RealTimeStatus />
          </div>
        </div>

        {/* Mobile Bottom Navigation - Make it functional */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MobileNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        )}
      </div>

      <Footer isMobile={isMobile} />
    </div>
  );
};

export default Dashboard;
