import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@shared/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  Car,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { useAuth } from "@shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@shared/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const AvailableRides = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [searchUniversity, setSearchUniversity] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // --- DYNAMIC ADMIN USER IDS ---
  const { data: adminUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id");
      if (error) throw error;
      return data?.map((u) => u.user_id) || [];
    },
  });

  // --- DYNAMIC AVAILABLE RIDES QUERY ---
  const {
    data: availableRides,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["available-rides", adminUsers],
    enabled: !!adminUsers && adminUsers.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rides")
        .select(`*, ride_bookings(seats_booked), driver_profiles(full_name)`)
        .gte("departure_date", new Date().toISOString().split("T")[0])
        .in("user_id", adminUsers)
        .order("departure_date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // --- ADMIN PRICING TABLE FETCH ---
  const { data: pricingTable } = useQuery({
    queryKey: ["pricing-table"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Helper to get price for a ride (by from_type, from_location, to_type, to_location, vehicle_type)
  const getDynamicPrice = (
    fromType,
    fromLocation,
    toType,
    toLocation,
    vehicleType
  ) => {
    if (!pricingTable) return 0;
    // Try to match both directions
    const match = pricingTable.find(
      (p) =>
        ((p.from_type === fromType &&
          p.from_location === fromLocation &&
          p.to_type === toType &&
          p.to_location === toLocation) ||
          (p.from_type === toType &&
            p.from_location === toLocation &&
            p.to_type === fromType &&
            p.to_location === fromLocation)) &&
        (!vehicleType || p.vehicle_type === vehicleType)
    );
    return match ? match.price_per_seat : 0;
  };

  // Remove ride (admin only)
  const handleRemoveRide = async (rideId) => {
    // Only allow removal if user is admin (replace with actual admin check if needed)
    // For now, disable/remove this feature for non-admin users
    return;
    // const { error } = await supabase.from("rides").delete().eq("id", rideId);
    // if (error) {
    //   toast.error("Failed to remove ride");
    // } else {
    //   toast.success("Ride removed");
    //   refetch();
    // }
  };

  // Fetch all rides for admin debug (ignoring filters)
  const { data: allRides } = useQuery({
    queryKey: ["all-rides-admin-debug"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return [];
      return data || [];
    },
    // Only fetch if there are no available rides
    enabled: !availableRides || availableRides.length === 0,
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("available-rides-changes")
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
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_bookings",
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

  const handleJoinRide = async (rideId, availableSeats) => {
    if (!user) {
      toast.error("Please sign in to book a ride");
      navigate("/signin");
      return;
    }
    if (availableSeats <= 0) {
      toast.error("No seats available for this ride");
      return;
    }
    try {
      const ride = availableRides?.find((r) => r.id === rideId);
      if (ride) {
        sessionStorage.setItem(
          "ridebuddy_prefilledRide",
          JSON.stringify({
            prefilledRide: {
              id: ride.id,
              from_location: ride.from_location,
              to_location: ride.to_location,
              departure_date: ride.departure_date,
              departure_time: ride.departure_time,
              price:
                ride.price_per_seat ||
                Math.round((ride.price || 5000) / (ride.vehicle_capacity || 6)),
              vehicle_type: ride.vehicle_type,
              vehicle_capacity: ride.vehicle_capacity,
            },
            availableSeats,
          })
        );
        navigate("/schedule", {
          state: {
            prefilledRide: {
              id: ride.id,
              from_location: ride.from_location,
              to_location: ride.to_location,
              departure_date: ride.departure_date,
              departure_time: ride.departure_time,
              price:
                ride.price_per_seat ||
                Math.round((ride.price || 5000) / (ride.vehicle_capacity || 6)),
              vehicle_type: ride.vehicle_type,
              vehicle_capacity: ride.vehicle_capacity,
            },
            availableSeats,
          },
        });
      }
    } catch (error) {
      console.error("Error joining ride:", error);
      toast.error("Failed to join ride. Please try again.");
    }
  };

  // DEV/ADMIN: Clear all rides and bookings for a fresh start
  // useEffect(() => {
  //   const clearDB = async () => {
  //     await fetch("/api/admin/clear", { method: "POST" });
  //   };
  //   clearDB();
  // }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Helper to get unique university locations from available rides
  const universityOptions = Array.from(
    new Set(
      (availableRides || [])
        .map((ride) => [ride.from_location, ride.to_location])
        .flat()
    )
  ).filter((loc) => loc && loc.toLowerCase().includes("university"));

  // Filter rides based on search
  const filteredRides = (availableRides || []).filter((ride) => {
    const matchesDate =
      !searchDate ||
      (ride.departure_date &&
        format(new Date(ride.departure_date), "yyyy-MM-dd") ===
          format(searchDate, "yyyy-MM-dd"));
    const matchesUniversity =
      !searchUniversity ||
      ride.from_location === searchUniversity ||
      ride.to_location === searchUniversity;
    return matchesDate && matchesUniversity;
  });

  if (!availableRides || availableRides.length === 0) {
    return (
      <div className="w-full max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Available Rides
            </h3>
            <p className="text-gray-600 mb-6">
              There are currently no rides available. Check back later or create
              your own ride request.
            </p>
            <Button
              onClick={() => navigate("/schedule")}
              className="bg-black text-white hover:bg-gray-800"
            >
              Schedule a Ride
            </Button>

            {/* Show all rides for debugging/admin */}
            {/* <div className="mt-8">
              <h4 className="font-semibold mb-2">
                All Rides in DB (Admin Debug)
              </h4>
              <ul className="text-left max-h-64 overflow-y-auto text-xs">
                {allRides && allRides.length === 0 && (
                  <li className="text-gray-400">No rides found in DB.</li>
                )}
                {allRides &&
                  allRides.map((ride) => {
                    // Check if this ride would match the available rides filter
                    const today = new Date().toISOString().split("T")[0];
                    const matchesStatus = ride.status === "pending";
                    const matchesDate = ride.departure_date >= today;
                    return (
                      <li key={ride.id} className="mb-2 border-b pb-1">
                        <span className="font-bold">
                          {ride.from_location} → {ride.to_location}
                        </span>{" "}
                        | {ride.departure_date} {ride.departure_time} | Status:{" "}
                        {ride.status} | Created: {ride.created_at}
                        <br />
                        <span className="text-gray-500">
                          ID: {ride.id} | User: {ride.user_id} | Price:{" "}
                          {ride.price} | Seats: {ride.seats_requested}
                        </span>
                        <br />
                        <span className="text-gray-400">
                          departure_date (raw): {String(ride.departure_date)} |
                          type: {typeof ride.departure_date} | matches filter:{" "}
                          {matchesStatus && matchesDate ? "YES" : "NO"}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Modern Search Bar Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end gap-4 md:gap-8 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Date Picker */}
        <div className="flex-1 flex flex-col min-w-[180px]">
          <Label
            htmlFor="search-date"
            className="mb-1 text-gray-700 font-semibold"
          >
            Date
          </Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-300 bg-gray-50 hover:bg-gray-100",
                  !searchDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {searchDate ? format(searchDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={searchDate}
                onSelect={(date) => {
                  setSearchDate(date ?? undefined);
                  setDatePickerOpen(false);
                }}
                initialFocus
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* University Search */}
        <div className="flex-1 flex flex-col min-w-[220px]">
          <Label
            htmlFor="search-university"
            className="mb-1 text-gray-700 font-semibold"
          >
            University
          </Label>
          <div className="relative">
            <Input
              id="search-university"
              list="university-options"
              value={searchUniversity}
              onChange={(e) => setSearchUniversity(e.target.value)}
              placeholder="Type or select university..."
              className="w-full border-gray-300 bg-gray-50 pl-10 focus:border-black focus:ring-2 focus:ring-black/20 transition rounded-xl"
              autoComplete="off"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <datalist id="university-options">
              {universityOptions.map((uni) => (
                <option key={uni} value={uni} />
              ))}
            </datalist>
          </div>
        </div>
        {/* Clear Button */}
        <div className="flex flex-row gap-2 mt-2 md:mt-0">
          {(searchDate || searchUniversity) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchDate(undefined);
                setSearchUniversity("");
              }}
              className="h-10 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-4">
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredRides.slice(0, 20).map((ride) => {
            // Calculate available seats (fallback to 0 if bookings missing)
            const totalBookedSeats = Array.isArray(ride.ride_bookings)
              ? ride.ride_bookings.reduce(
                  (sum, booking) => sum + (booking.seats_booked || 0),
                  0
                )
              : 0;
            const availableSeats =
              (ride.vehicle_capacity || 6) - totalBookedSeats;
            return (
              <Card
                key={ride.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Route Information */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold text-lg">
                          {ride.from_location} → {ride.to_location}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {new Date(ride.departure_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{ride.departure_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          <span>{ride.vehicle_type || "Standard"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{availableSeats} seats left</span>
                        </div>
                      </div>
                      {ride.driver_profiles && (
                        <div className="mt-3 text-sm text-gray-600">
                          Driver: {ride.driver_profiles.full_name}
                        </div>
                      )}
                    </div>
                    {/* Price and Action */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="text-center lg:text-right">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          ₦
                          {(() => {
                            // Prefer dynamic price if available
                            const dynamic = getDynamicPrice(
                              ride.from_type,
                              ride.from_location,
                              ride.to_type,
                              ride.to_location,
                              ride.vehicle_type
                            );
                            if (dynamic > 0) return dynamic;
                            // Fallback to static price if no dynamic pricing found
                            return Math.round((ride.price || 5000) / 100) * 100;
                          })()}
                        </div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                          {ride.price_per_seat
                            ? "Dynamic pricing"
                            : "Static pricing"}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJoinRide(ride.id, availableSeats)}
                        className={
                          `w-full md:w-auto rounded-3xl font-semibold transition-colors duration-150 ` +
                          (availableSeats > 0
                            ? "bg-black text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
                            : "bg-gray-300 text-gray-400 cursor-not-allowed")
                        }
                        disabled={availableSeats <= 0}
                      >
                        {availableSeats > 0 ? "Join Ride" : "Fully Booked"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvailableRides;
