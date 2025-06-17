
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import Footer from "@/components/dashboard/Footer";
import UserBookings from "@/components/UserBookings";
import AvailableRides from "@/components/AvailableRides";
import RideRequestForm from "@/components/RideRequestForm";
import QuickRoutes from "@/components/dashboard/QuickRoutes";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Clock, MapPin, Car, Route, Users } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useAvailableRides } from "@/hooks/useAvailableRides";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("book-ride");
  const isMobile = useIsMobile();
  const { userProfile } = useAuth();
  const { userBookings } = useBookings();
  const { availableRides } = useAvailableRides();

  const userName = userProfile?.full_name?.split(' ')[0] || 'User';

  // Popular routes for quick booking
  const popularRoutes = [
    { from: "Lagos", to: "University of Ibadan", price: "₦2,500" },
    { from: "Abuja", to: "University of Lagos", price: "₦5,000" },
    { from: "Port Harcourt", to: "University of Nigeria Nsukka", price: "₦4,000" },
    { from: "Kano", to: "Ahmadu Bello University", price: "₦1,500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <WelcomeHeader name={userName} />
        
        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("book-ride")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableRides?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Ready to book now</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("my-bookings")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBookings?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total bookings</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("quick-routes")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Routes</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{popularRoutes.length}</div>
              <p className="text-xs text-muted-foreground">Popular destinations</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("request-ride")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Request Ride</CardTitle>
              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">New</div>
              <p className="text-xs text-muted-foreground">Custom route request</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="book-ride">Book Ride</TabsTrigger>
            <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="quick-routes">Quick Routes</TabsTrigger>
            <TabsTrigger value="request-ride">Request Ride</TabsTrigger>
          </TabsList>

          <TabsContent value="book-ride">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Available Rides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AvailableRides />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-bookings">
            <UserBookings />
          </TabsContent>

          <TabsContent value="quick-routes">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Popular Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <QuickRoutes routes={popularRoutes} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="request-ride">
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
