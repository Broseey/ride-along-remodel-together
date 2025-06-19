
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import Footer from "@/components/dashboard/Footer";
import UserBookings from "@/components/UserBookings";
import AvailableRides from "@/components/AvailableRides";
import RideRequestForm from "@/components/RideRequestForm";
import RideBookingFormNew from "@/components/RideBookingFormNew";
import QuickRoutes from "@/components/dashboard/QuickRoutes";
import UserProfileManager from "@/components/UserProfileManager";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Clock, MapPin, Car, Route, Users, User, Ticket, TrendingUp } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useAvailableRides } from "@/hooks/useAvailableRides";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("schedule-ride");
  const isMobile = useIsMobile();
  const { userProfile } = useAuth();
  const { userBookings } = useBookings();
  const { availableRides } = useAvailableRides();

  const userName = userProfile?.full_name?.split(' ')[0] || 'User';

  // Popular routes for quick booking
  const popularRoutes = [
    { from: "Lagos", to: "University of Ibadan (UI)", price: "₦2,500" },
    { from: "Abuja", to: "University of Lagos (UNILAG)", price: "₦5,000" },
    { from: "Port Harcourt", to: "University of Nigeria, Nsukka (UNN)", price: "₦4,000" },
    { from: "Kano", to: "Ahmadu Bello University (ABU)", price: "₦1,500" },
    { from: "Ibadan", to: "Obafemi Awolowo University (OAU)", price: "₦1,800" },
    { from: "Lagos", to: "Covenant University", price: "₦2,000" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <WelcomeHeader name={userName} />
        
        {/* Improved phone warning */}
        {!userProfile?.phone_number && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Phone number required:</span> Please update your profile with a phone number to make ride bookings.
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className="ml-2 underline font-medium hover:text-yellow-900 transition-colors"
                  >
                    Update now →
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Quick Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" onClick={() => setActiveTab("book-ride")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Available Rides</CardTitle>
              <Car className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{availableRides?.length || 0}</div>
              <p className="text-xs text-blue-600">Ready to book now</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200" onClick={() => setActiveTab("my-bookings")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">My Bookings</CardTitle>
              <Ticket className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{userBookings?.length || 0}</div>
              <p className="text-xs text-green-600">Total bookings</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" onClick={() => setActiveTab("quick-routes")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Quick Routes</CardTitle>
              <Route className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{popularRoutes.length}</div>
              <p className="text-xs text-purple-600">Popular destinations</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200" onClick={() => setActiveTab("schedule-ride")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Schedule Ride</CardTitle>
              <CalendarPlus className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">Book</div>
              <p className="text-xs text-orange-600">Schedule your journey</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200" onClick={() => setActiveTab("profile")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">My Profile</CardTitle>
              <User className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">Edit</div>
              <p className="text-xs text-gray-600">Update details</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Enhanced Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="schedule-ride" className="text-xs md:text-sm">Schedule</TabsTrigger>
                <TabsTrigger value="book-ride" className="text-xs md:text-sm">Available</TabsTrigger>
                <TabsTrigger value="my-bookings" className="text-xs md:text-sm">Bookings</TabsTrigger>
                <TabsTrigger value="quick-routes" className="text-xs md:text-sm">Routes</TabsTrigger>
                <TabsTrigger value="request-ride" className="text-xs md:text-sm">Request</TabsTrigger>
                <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="schedule-ride" className="mt-0">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Your Ride</h2>
                    <p className="text-gray-600">Find and book rides for your preferred route and time</p>
                  </div>
                  <div className="max-w-2xl mx-auto">
                    <RideBookingFormNew />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="book-ride" className="mt-0">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Rides</h2>
                    <p className="text-gray-600">Browse and book available rides</p>
                  </div>
                  <AvailableRides />
                </div>
              </TabsContent>

              <TabsContent value="my-bookings" className="mt-0">
                <UserBookings />
              </TabsContent>

              <TabsContent value="quick-routes" className="mt-0">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Routes</h2>
                    <p className="text-gray-600">Quick access to frequently traveled routes</p>
                  </div>
                  <QuickRoutes routes={popularRoutes} />
                </div>
              </TabsContent>

              <TabsContent value="request-ride" className="mt-0">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Ride</h2>
                    <p className="text-gray-600">Can't find what you're looking for? Request a custom ride</p>
                  </div>
                  <RideRequestForm />
                </div>
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                  </div>
                  <UserProfileManager />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
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
