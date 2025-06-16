
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import Footer from "@/components/dashboard/Footer";
import UserBookings from "@/components/UserBookings";
import AvailableRides from "@/components/AvailableRides";
import RideRequestForm from "@/components/RideRequestForm";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Clock, MapPin, Car } from "lucide-react";
import { useRideRequests } from "@/hooks/useRideRequests";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const isMobile = useIsMobile();
  const { userProfile } = useAuth();
  const { userRideRequests } = useRideRequests();

  const userName = userProfile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <WelcomeHeader name={userName} />
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View All</div>
              <p className="text-xs text-muted-foreground">Active and past rides</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rides</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Browse</div>
              <p className="text-xs text-muted-foreground">Find your next ride</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ride Requests</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userRideRequests?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Pending requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Request</CardTitle>
              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Create</div>
              <p className="text-xs text-muted-foreground">Request new route</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="available">Available Rides</TabsTrigger>
            <TabsTrigger value="request">Request Ride</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <UserBookings />
          </TabsContent>

          <TabsContent value="available">
            <AvailableRides />
          </TabsContent>

          <TabsContent value="request">
            <RideRequestForm />
          </TabsContent>
        </Tabs>
        
        {/* Mobile Bottom Navigation */}
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
