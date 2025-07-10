import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import RideBookingFormNew from "@/components/RideBookingFormNew";
import { Link } from "react-router-dom";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import { useIsMobile } from "@shared/hooks/use-mobile";
import { supabase } from "@shared/integrations/supabase/client";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface PopularRoute {
  from: string;
  to: string;
  count: number;
  price: string;
}

const Schedule = () => {
  const location = useLocation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const isMobile = useIsMobile();

  const timeSlots = [
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
  ];

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      setLoadingPopular(true);
      // Fetch recent rides (limit for performance)
      const { data: rides, error: ridesError } = await supabase
        .from("rides")
        .select("from_location, to_location")
        .limit(5000); // adjust as needed
      if (ridesError || !rides) {
        setPopularRoutes([]);
        setLoadingPopular(false);
        return;
      }
      // Debug logs
      console.log("RIDES:", rides);
      // Group by from_location/to_location in JS
      const routeMap = new Map<
        string,
        { from: string; to: string; count: number }
      >();
      rides.forEach((ride: { from_location: string; to_location: string }) => {
        const key = `${ride.from_location}|${ride.to_location}`;
        if (routeMap.has(key)) {
          routeMap.get(key)!.count++;
        } else {
          routeMap.set(key, {
            from: ride.from_location,
            to: ride.to_location,
            count: 1,
          });
        }
      });
      const topRoutes = Array.from(routeMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
      console.log("TOP ROUTES:", topRoutes);
      const routePromises = topRoutes.map(async (route) => {
        let { data: pricing } = await supabase
          .from("route_pricing")
          .select("base_price")
          .eq("from_location", route.from)
          .eq("to_location", route.to)
          .single();
        if (!pricing) {
          const { data: reverse } = await supabase
            .from("route_pricing")
            .select("base_price")
            .eq("from_location", route.to)
            .eq("to_location", route.from)
            .single();
          pricing = reverse;
        }
        const price =
          pricing && pricing.base_price ? `₦${pricing.base_price}` : "N/A";
        return { ...route, price };
      });
      const routesWithPrices = await Promise.all(routePromises);
      console.log("ROUTES WITH PRICES:", routesWithPrices);
      setPopularRoutes(routesWithPrices);
      setLoadingPopular(false);
    };
    fetchPopularRoutes();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Schedule | Uniride</title>
        <meta
          name="description"
          content="View your upcoming Uniride trips and ride schedule. Stay organized and never miss your next campus journey."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
          {" "}
          {/* Add pb-24 for mobile nav space */}
          <h1 className="text-3xl font-bold mb-6">Schedule a Ride</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <RideBookingFormNew navigationState={location.state} />
            </div>

            <div className="md:w-1/2">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Popular Routes</CardTitle>
                  <CardDescription>Frequently traveled routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingPopular ? (
                      <div className="text-center text-gray-400">
                        Loading...
                      </div>
                    ) : popularRoutes.length === 0 ? (
                      <div className="text-center text-gray-400">
                        No popular routes found.
                      </div>
                    ) : (
                      popularRoutes.map((route, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 mr-3 mt-1 text-gray-500" />
                            <div>
                              <p className="font-medium">
                                {route.from} → {route.to}
                              </p>
                              <p className="text-sm text-gray-500">
                                Starting from {route.price}
                              </p>
                            </div>
                          </div>
                          <Link to="/signin">
                            <Button
                              size="sm"
                              className="bg-black text-white hover:bg-neutral-800 transform active:scale-95 transition-transform duration-200"
                            >
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MobileNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default Schedule;
