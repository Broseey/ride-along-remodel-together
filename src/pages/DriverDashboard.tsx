import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import {
  Truck,
  DollarSign,
  Clock,
  MapPin,
  Users,
  Star,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import DriverNavbar from "@/components/navbar/DriverNavbar";
import { Helmet, HelmetProvider } from "react-helmet-async";

const DriverDashboard = () => (
  <HelmetProvider>
    <>
      <Helmet>
        <title>Driver Dashboard | Uniride</title>
        <meta
          name="description"
          content="Manage your rides, earnings, and profile as a Uniride driver. Access your dashboard for all driver tools and information."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <DriverNavbar />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Driver!</h1>
            <p className="text-gray-600">
              Here's your driving activity overview
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Earnings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦12,500</div>
                <p className="text-xs text-muted-foreground">
                  +15% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trips Completed
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Hours Online
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.5</div>
                <p className="text-xs text-muted-foreground">Target: 8 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">
                  Based on 124 rides
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Go Online Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Start Driving
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Ready to start earning? Go online to receive ride requests.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Go Online
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Set Preferred Area
                </Button>
              </CardContent>
            </Card>

            {/* Recent Trips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Recent Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Yaba → Victoria Island</p>
                      <p className="text-sm text-gray-600">2 passengers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦2,500</p>
                      <p className="text-sm text-gray-600">Today 3:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Ikeja → Lekki</p>
                      <p className="text-sm text-gray-600">1 passenger</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦3,200</p>
                      <p className="text-sm text-gray-600">Today 1:15 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Surulere → Ikoyi</p>
                      <p className="text-sm text-gray-600">3 passengers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦2,800</p>
                      <p className="text-sm text-gray-600">Today 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/driver-earnings">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center w-full"
                >
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span>Earnings</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Calendar className="h-6 w-6 mb-2" />
                <span>Schedule</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Passengers</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <MapPin className="h-6 w-6 mb-2" />
                <span>Routes</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  </HelmetProvider>
);

export default DriverDashboard;
