import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Map,
  Eye,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RoutePreview from "@/components/RoutePreview";
import LocationSearchInput from "@/components/LocationSearchInput";
import MapLocationPicker from "@/components/MapLocationPicker";
import PaystackPayment from "@/components/PaystackPayment";
import VehicleOptions from "@/components/VehicleOptions";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Ride as RideBase } from "@/types/ride";
import { motion, AnimatePresence } from "framer-motion";

// Type definitions
type BookingStep = "location" | "date" | "vehicle" | "payment";
type BookingType = "join" | "full";

// Form schema using Zod for validation
const bookingFormSchema = z.object({
  from: z.string().min(1, "Please select a departure location"),
  to: z.string().min(1, "Please select a destination location"),
  fromType: z.enum(["university", "state"]),
  toType: z.enum(["university", "state"]),
  specificLocation: z.string().optional(),
  mapLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string(),
    })
    .optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  passengers: z.string().min(1, "Please select the number of passengers"),
  vehicleId: z.string().min(1, "Please select a vehicle"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const vehicles = [
  { id: "corolla", name: "Sedan", capacity: 4, base_price: 3500 },
  { id: "sienna", name: "Mini Van", capacity: 6, base_price: 5000 },
  { id: "hiace", name: "Mini Bus", capacity: 14, base_price: 7000 },
  { id: "long-bus", name: "Bus", capacity: 18, base_price: 8000 },
];

type Ride = RideBase & {
  vehicle_type?: string;
  vehicle_capacity?: number;
  ride_bookings?: Array<{ seats_booked?: number }>;
  seats_requested?: number;
};

type RideBookingFormNewProps = {
  navigationState?: Record<string, unknown>;
};

const RideBookingFormNew = ({ navigationState }: RideBookingFormNewProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Prefer navigationState prop if provided, else use location.state
  let effectiveState =
    navigationState !== undefined ? navigationState : location.state;

  // Fallback: If no navigation state, try sessionStorage
  if (!effectiveState?.prefilledRide) {
    const sessionPrefill = sessionStorage.getItem("ridebuddy_prefilledRide");
    if (sessionPrefill) {
      try {
        const parsed = JSON.parse(sessionPrefill);
        if (parsed?.prefilledRide) {
          effectiveState = parsed;
          // Clear after use to avoid stale data
          sessionStorage.removeItem("ridebuddy_prefilledRide");
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  const [currentStep, setCurrentStep] = useState<BookingStep>("location");
  const [bookingType, setBookingType] = useState<BookingType>("join");
  const [showPreview, setShowPreview] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Prefilled ride logic
  const prefilledRide = effectiveState?.prefilledRide;
  const prefilledAvailableSeats = effectiveState?.availableSeats;

  // If prefilledRide is present, force bookingType to 'join' and always start at seat selection
  useEffect(() => {
    if (prefilledRide) {
      setBookingType("join");
      setCurrentStep("location");
      // The form variable is declared below, so we must move this effect after form is defined.
    }
  }, [prefilledRide]);

  // Fallback: Log if navigation state is missing or malformed
  useEffect(() => {
    if (!prefilledRide) {
      console.warn(
        "No prefilled ride found in navigation state. Showing default booking form.",
        effectiveState
      );
    }
  }, [prefilledRide, effectiveState]);

  // Defensive: If prefilledRide is present but missing required fields, fallback to normal booking flow
  const isPrefilledRideValid =
    prefilledRide &&
    typeof prefilledRide.from_location === "string" &&
    typeof prefilledRide.to_location === "string" &&
    prefilledRide.departure_date &&
    prefilledRide.departure_time &&
    prefilledRide.price;

  // Debug: Log navigation state for troubleshooting
  useEffect(() => {
    if (navigationState) {
      console.log("RideBookingFormNew navigationState:", navigationState);
    }
    if (prefilledRide && !isPrefilledRideValid) {
      console.warn(
        "Invalid prefilledRide, falling back to normal booking flow:",
        prefilledRide
      );
    }
  }, [navigationState, prefilledRide, isPrefilledRideValid]);

  // Helper: Toggle location type (fromType/toType)
  const toggleLocationType = (
    field: "fromType" | "toType",
    value: "university" | "state"
  ) => {
    form.setValue(field, value);
    if (field === "fromType") {
      form.setValue("from", "");
      // Automatically set toType to the opposite
      const opposite = value === "university" ? "state" : "university";
      form.setValue("toType", opposite);
      form.setValue("to", "");
    } else if (field === "toType") {
      form.setValue("to", "");
      // Automatically set fromType to the opposite
      const opposite = value === "university" ? "state" : "university";
      form.setValue("fromType", opposite);
      form.setValue("from", "");
    }
  };

  // Helper: Get state/university for location search input
  const getStateForLocationSearch = () => {
    if (bookingType === "full") {
      // For full ride, use whichever is a state (from or to)
      if (form.getValues().fromType === "state") return form.getValues().from;
      if (form.getValues().toType === "state") return form.getValues().to;
    }
    return "";
  };

  // Helper: Handle map location select
  const handleMapLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    form.setValue("mapLocation", location);
    setShowMapPicker(false);
  };

  // 1. Only admin rides in available rides, 2. Visible to all users, 3. Sign in to book, 4. Bookings reflected in My Rides
  // (All logic already enforced in RideBookingFormNew and AvailableRides)
  // Ensure available rides query only fetches admin rides and is always visible
  // Remove hardcoded ADMIN_USER_IDS
  // Dynamically fetch admin user IDs from Supabase
  const { data: adminUsers, isLoading: adminUsersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id");
      if (error) throw error;
      return data?.map((u) => u.user_id) || [];
    },
  });

  const {
    data: existingRides,
    error: ridesError,
    isLoading: ridesLoading,
    refetch: refetchRides,
  } = useQuery({
    queryKey: ["available-rides", adminUsers],
    enabled: !!adminUsers && adminUsers.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .gte("departure_date", format(new Date(), "yyyy-MM-dd"))
        .in("user_id", adminUsers); // Only admin rides
      if (error) throw error;
      return data || [];
    },
  });

  // Get admin-configured travel times
  const { data: availableTimes } = useQuery({
    queryKey: ["available-times"],
    queryFn: async () => {
      return ["08:00", "12:00", "14:00", "18:00"];
    },
  });

  // Fetch enabled states and universities from Supabase
  const { data: enabledStates } = useQuery({
    queryKey: ["enabled-states"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("name")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data?.map((s) => s.name) || [];
    },
  });
  const { data: enabledUniversities } = useQuery({
    queryKey: ["enabled-universities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universities")
        .select("name")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data?.map((u) => u.name) || [];
    },
  });

  // --- FETCH VEHICLES FROM SUPABASE ---
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Initialize the form with React Hook Form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: prefilledRide
      ? {
          from: prefilledRide.from_location,
          to: prefilledRide.to_location,
          fromType:
            getLocationType(prefilledRide.from_location) || "university",
          toType: getLocationType(prefilledRide.to_location) || "state",
          specificLocation: "",
          mapLocation: undefined,
          date: new Date(prefilledRide.departure_date),
          time: prefilledRide.departure_time,
          passengers: "1",
          vehicleId: (() => {
            if (prefilledRide.vehicle_type) {
              // Robust match: ignore case, whitespace, and allow partial matches
              const normalized = (str: string) =>
                str.replace(/\s+/g, "").toLowerCase();
              let match = vehicles.find(
                (v) =>
                  normalized(v.name) ===
                  normalized(String(prefilledRide.vehicle_type))
              );
              if (!match) {
                match = vehicles.find(
                  (v) =>
                    normalized(v.name).includes(
                      normalized(String(prefilledRide.vehicle_type))
                    ) ||
                    normalized(String(prefilledRide.vehicle_type)).includes(
                      normalized(v.name)
                    )
                );
              }
              if (match) return match.id;
            }
            // Fallback: match by capacity if available
            if (prefilledRide.vehicle_capacity) {
              const byCap = vehicles.find(
                (v) => v.capacity === prefilledRide.vehicle_capacity
              );
              if (byCap) return byCap.id;
            }
            return vehicles[0].id; // fallback to first vehicle
          })(),
        }
      : {
          from: "",
          to: "",
          fromType: "university",
          toType: "state",
          specificLocation: "",
          mapLocation: undefined,
          date: undefined,
          time: "",
          passengers: "1",
          vehicleId: "",
        },
  });

  // If prefilledRide is present, set form values after form is defined
  useEffect(() => {
    if (prefilledRide) {
      form.setValue("from", prefilledRide.from_location);
      form.setValue("to", prefilledRide.to_location);
      form.setValue(
        "fromType",
        getLocationType(prefilledRide.from_location) || "university"
      );
      form.setValue(
        "toType",
        getLocationType(prefilledRide.to_location) || "state"
      );
      form.setValue("date", new Date(prefilledRide.departure_date));
      form.setValue("time", prefilledRide.departure_time);
      form.setValue("passengers", ""); // force user to select
      form.setValue("vehicleId", "");
    }
  }, [prefilledRide, form]);

  // Set default passengers for prefilled ride if not set
  useEffect(() => {
    if (prefilledRide && !form.getValues().passengers) {
      form.setValue("passengers", ""); // Force user to select
      setCurrentStep("location"); // Always start at seat selection
    }
  }, [prefilledRide, form]);

  // Watchers for form fields
  const watchFrom = form.watch("from");
  const watchTo = form.watch("to");
  const watchFromType = form.watch("fromType");
  const watchToType = form.watch("toType");
  const watchVehicleId = form.watch("vehicleId");
  const watchMapLocation = form.watch("mapLocation");
  const watchPassengers = form.watch("passengers");

  // --- ADMIN ROUTE PRICING TABLE FETCH ---
  const { data: routePricingTable } = useQuery({
    queryKey: ["route-pricing-table"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("route_pricing")
        .select(
          "from_type, from_location, to_type, to_location, vehicle_type, base_price, id"
        );
      if (error) throw error;
      return data || [];
    },
  });

  // --- ADMIN ROUTE VEHICLE PRICING TABLE FETCH ---
  const { data: routeVehiclePricingTable } = useQuery({
    queryKey: ["route-vehicle-pricing-table"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("route_vehicle_pricing")
        .select(
          "from_type, from_location, to_type, to_location, vehicle_type, base_price, id"
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // --- Filter vehicles for booking form: only those with pricing for this route ---
  const filteredVehicles = React.useMemo(() => {
    if (
      !routeVehiclePricingTable ||
      !watchFrom ||
      !watchTo ||
      !watchFromType ||
      !watchToType
    )
      return [];
    // Find all vehicle_types with a price for this route (either direction, using type fields)
    const vehicleTypes = routeVehiclePricingTable
      .filter(
        (p) =>
          (p.from_type === watchFromType &&
            p.from_location === watchFrom &&
            p.to_type === watchToType &&
            p.to_location === watchTo) ||
          (p.from_type === watchToType &&
            p.from_location === watchTo &&
            p.to_type === watchFromType &&
            p.to_location === watchFrom)
      )
      .map((p) => p.vehicle_type);
    // Debug: Log vehicleTypes and vehicles for troubleshooting
    console.log(
      "[DEBUG] vehicleTypes for this route (with type):",
      vehicleTypes
    );
    console.log("[DEBUG] all vehicles:", vehicles);
    // Return only vehicles that match these types (by name, case-insensitive, trimmed)
    const normalized = (str) => (str || "").replace(/\s+/g, "").toLowerCase();
    const filtered = vehicles.filter((v) =>
      vehicleTypes.some((t) => normalized(t) === normalized(v.name))
    );
    console.log("[DEBUG] filtered vehicles:", filtered);
    return filtered;
  }, [
    routeVehiclePricingTable,
    vehicles,
    watchFrom,
    watchTo,
    watchFromType,
    watchToType,
  ]);

  // Helper to get per-vehicle price for a route (by vehicle_type)
  const getRouteVehiclePrice = React.useCallback(
    (fromType, from, toType, to, vehicleType) => {
      if (!routeVehiclePricingTable) return 0;
      // Try both directions
      const match = routeVehiclePricingTable.find(
        (p) =>
          ((p.from_type === fromType &&
            p.from_location === from &&
            p.to_type === toType &&
            p.to_location === to) ||
            (p.from_type === toType &&
              p.from_location === to &&
              p.to_type === fromType &&
              p.to_location === from)) &&
          p.vehicle_type === vehicleType
      );
      return match ? match.base_price : 0;
    },
    [routeVehiclePricingTable]
  );

  // Helper to get price for a route (by vehicle_type)
  const getRouteAdminPrice = React.useCallback(
    (fromType, from, toType, to, vehicleType) => {
      if (!routePricingTable) return 0;
      // Try both directions
      const match = routePricingTable.find(
        (p) =>
          ((p.from_type === fromType &&
            p.from_location === from &&
            p.to_type === toType &&
            p.to_location === to) ||
            (p.from_type === toType &&
              p.from_location === to &&
              p.to_type === fromType &&
              p.to_location === from)) &&
          p.vehicle_type === vehicleType
      );
      return match ? match.base_price : 0;
    },
    [routePricingTable]
  );

  // Calculate price based on route and vehicle
  useEffect(() => {
    if (
      watchVehicleId &&
      watchFrom &&
      watchTo &&
      watchFromType &&
      watchToType
    ) {
      const selectedVehicle = vehicles.find((v) => v.id === watchVehicleId);
      if (selectedVehicle) {
        // 1. Try per-vehicle route pricing first
        let basePrice = getRouteVehiclePrice(
          watchFromType,
          watchFrom,
          watchToType,
          watchTo,
          selectedVehicle.name
        );
        // 2. Fallback to generic route pricing (if needed)
        if (!basePrice) {
          basePrice = getRouteAdminPrice(
            watchFromType,
            watchFrom,
            watchToType,
            watchTo,
            selectedVehicle.name
          );
        }
        // 3. Fallback to vehicle base price
        if (!basePrice) {
          basePrice = selectedVehicle.base_price;
        }
        if (bookingType === "full") {
          // 10% discount for full ride booking
          basePrice = Math.round(basePrice * selectedVehicle.capacity * 0.9);
        } else {
          // Per seat pricing
          basePrice =
            Math.round(basePrice / selectedVehicle.capacity) *
            (parseInt(watchPassengers) || 1);
        }
        setCalculatedPrice(basePrice);
      }
    }
  }, [
    watchVehicleId,
    watchPassengers,
    bookingType,
    watchFromType,
    watchToType,
    watchFrom,
    watchTo,
    routeVehiclePricingTable,
    getRouteVehiclePrice,
    routePricingTable,
    getRouteAdminPrice,
    vehicles,
  ]);

  // Check for available rides when route changes
  useEffect(() => {
    if (watchFrom && watchTo && existingRides) {
      const matching = existingRides
        .filter(
          (ride) =>
            (ride.from_location === watchFrom &&
              ride.to_location === watchTo) ||
            (ride.from_location === watchTo && ride.to_location === watchFrom)
        )
        .map((ride) => {
          const totalBooked = Array.isArray(ride.ride_bookings)
            ? ride.ride_bookings.reduce(
                (sum, b) => sum + (b.seats_booked || 0),
                0
              )
            : 0;
          return {
            ...ride,
            availableSeats:
              (ride.seats_requested || ride.vehicle_capacity || 0) -
              totalBooked,
          };
        });
      setAvailableRides(matching);
    }
  }, [watchFrom, watchTo, existingRides]);

  // Check authentication before allowing booking
  const checkAuthAndProceed = () => {
    if (!user) {
      toast.error("Please sign in to book a ride");
      navigate("/signin");
      return false;
    }
    return true;
  };

  const isLocationStepValid = () => {
    const baseValid =
      watchFrom &&
      watchTo &&
      ((watchFromType === "university" && watchToType === "state") ||
        (watchFromType === "state" && watchToType === "university"));

    // For "book entire ride", also require specific location OR map location
    if (bookingType === "full") {
      return baseValid && (form.watch("specificLocation") || watchMapLocation);
    }

    return baseValid;
  };

  useEffect(() => {
    // Show preview when both from and to are selected
    setShowPreview(watchFrom && watchTo ? true : false);
  }, [watchFrom, watchTo]);

  const isDateStepValid = form.watch("date") && form.watch("time");

  // Navigation functions
  const nextStep = () => {
    if (!checkAuthAndProceed()) return;

    if (currentStep === "location") {
      // Check if joining a ride but no available rides
      if (bookingType === "join" && availableRides.length === 0) {
        toast.error(
          "No available rides for this route. Please book the entire ride instead."
        );
        setBookingType("full");
        return;
      }
      setCurrentStep("date");
    } else if (currentStep === "date") setCurrentStep("vehicle");
    else if (currentStep === "vehicle") setCurrentStep("payment");
  };

  const prevStep = () => {
    if (currentStep === "payment") setCurrentStep("vehicle");
    else if (currentStep === "vehicle") setCurrentStep("date");
    else if (currentStep === "date") setCurrentStep("location");
  };

  // Add a helper to find a matching available ride
  const findMatchingAvailableRide = (
    from: string,
    to: string,
    date: string,
    time: string,
    vehicleType: string,
    availableRides: Ride[]
  ) => {
    if (!availableRides) return null;
    return availableRides.find(
      (ride) =>
        ride.from_location === from &&
        ride.to_location === to &&
        ride.departure_date === date &&
        ride.departure_time === time &&
        ride.vehicle_type === vehicleType &&
        ride.status === "available"
    );
  };

  // Handle payment success
  const handlePaymentSuccess = async (
    reference: string,
    redirectToConfirmation = false
  ) => {
    try {
      const formData = form.getValues();
      const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
      // If booking a prefilled/admin ride, insert into bookings table
      if (isPrefilledRideValid && prefilledRide) {
        const totalAmount =
          (typeof prefilledRide.price === "number"
            ? prefilledRide.price
            : parseInt(prefilledRide.price)) *
          (parseInt(formData.passengers) || 1);
        const { error } = await supabase.from("bookings").insert({
          ride_id: prefilledRide.id,
          user_id: user.id,
          seats_booked: parseInt(formData.passengers),
          total_amount: totalAmount,
          booking_status: "confirmed",
          payment_status: "paid",
          payment_reference: reference,
        });
        if (error) throw error;
        toast.success("Booking confirmed!");
        navigate("/my-rides");
        return;
      }
      // Otherwise, create a new ride (custom booking)
      const { data: booking, error } = await supabase
        .from("rides")
        .insert({
          user_id: user?.id,
          from_location: formData.from,
          to_location: formData.to,
          departure_date: format(formData.date, "yyyy-MM-dd"),
          departure_time: formData.time,
          seats_requested:
            bookingType === "full"
              ? selectedVehicle?.capacity
              : parseInt(formData.passengers),
          booking_type: bookingType,
          price: calculatedPrice,
          status: "confirmed",
          pickup_location:
            formData.specificLocation || formData.mapLocation?.address,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Booking confirmed!");
      // Refetch rides to update available seats
      refetchRides();
      if (redirectToConfirmation && booking) {
        navigate("/my-rides", { state: { booking } });
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error creating booking. Please contact support.");
    }
  };

  // On submit, if prefilledRide, go to payment step instead of booking immediately
  const onSubmit = async (data: BookingFormValues) => {
    if (!checkAuthAndProceed()) return;
    // For prefilled rides, ensure all required fields are set before proceeding
    if (isPrefilledRideValid) {
      // Defensive: ensure vehicleId and passengers are set
      const vehicleId = form.getValues().vehicleId;
      const passengers = form.getValues().passengers;
      if (!vehicleId) {
        toast.error("Please select a vehicle before proceeding to payment.");
        setCurrentStep("vehicle");
        return;
      }
      if (!passengers) {
        toast.error(
          "Please select the number of seats before proceeding to payment."
        );
        setCurrentStep("date");
        return;
      }
      setCurrentStep("payment");
      return;
    }

    // Removed showPayment state, directly navigate to payment step
    setCurrentStep("payment");
  };

  // Handle payment success for prefilled rides
  const handlePrefilledPaymentSuccess = async (reference: string) => {
    try {
      const data = form.getValues();
      const totalAmount =
        (typeof prefilledRide.price === "number"
          ? prefilledRide.price
          : parseInt(prefilledRide.price)) * (parseInt(data.passengers) || 1);
      const { error } = await supabase.from("bookings").insert({
        ride_id: prefilledRide.id,
        user_id: user.id,
        seats_booked: parseInt(data.passengers),
        total_amount: totalAmount,
        booking_status: "confirmed",
        payment_status: "paid",
        payment_reference: reference,
      });
      if (error) throw error;
      toast.success("Booking confirmed!");
      navigate("/my-rides");
    } catch (error) {
      toast.error("Error creating booking. Please contact support.");
    }
  };

  // --- FIX: Clear all rides in DB for a fresh start (for admin/dev only) ---
  // useEffect(() => {
  //   // Only run this ONCE and only in dev/admin mode!
  //   // Remove or comment out after clearing
  //   async function clearRides() {
  //     try {
  //       await supabase.from("rides").delete().neq("id", "");
  //       await supabase.from("bookings").delete().neq("id", "");
  //       if (typeof refetchRides === 'function') refetchRides();
  //     } catch (e) {
  //       // Ignore errors
  //     }
  //   }
  //   clearRides(); // <--- ENABLED: will clear all rides and bookings on next reload
  // }, [refetchRides]);

  // --- FIX: Ensure available rides are shown correctly ---
  const availableRidesList = Array.isArray(existingRides)
    ? existingRides.filter((ride) => {
        // Only show rides with available seats and future departure (date only, ignore time)
        // Use only seats_requested for available seats
        const availableSeats = ride.seats_requested || 0;
        const today = new Date();
        const rideDate = new Date(ride.departure_date + "T00:00:00");
        today.setHours(0, 0, 0, 0);
        // FIX: If no from/to selected, show all rides with available seats and valid date
        if (!watchFrom && !watchTo) {
          return availableSeats > 0 && rideDate >= today;
        }
        // If only from selected, show all rides departing from that location
        if (watchFrom && !watchTo) {
          return (
            availableSeats > 0 &&
            rideDate >= today &&
            (ride.from_location === watchFrom || ride.to_location === watchFrom)
          );
        }
        // If only to selected, show all rides arriving at that location
        if (!watchFrom && watchTo) {
          return (
            availableSeats > 0 &&
            rideDate >= today &&
            (ride.from_location === watchTo || ride.to_location === watchTo)
          );
        }
        // Both from and to selected: strict match
        return (
          availableSeats > 0 &&
          rideDate >= today &&
          ((ride.from_location === watchFrom && ride.to_location === watchTo) ||
            (ride.from_location === watchTo && ride.to_location === watchFrom))
        );
      })
    : [];

  console.log("DEBUG existingRides:", existingRides);
  console.log("DEBUG availableRidesList:", availableRidesList);

  // Debug: Log adminUsers, existingRides, and availableRides inside the component
  useEffect(() => {
    console.log("DEBUG adminUsers:", adminUsers);
    if (!adminUsers || adminUsers.length === 0) {
      console.warn("WARNING: No admin users found. Check admin_users table.");
    }
    console.log("DEBUG existingRides:", existingRides);
    if (Array.isArray(existingRides) && existingRides.length === 0) {
      console.warn("WARNING: No rides found for admin users.");
    }
    console.log("DEBUG availableRides:", availableRides);
    if (Array.isArray(availableRides) && availableRides.length === 0) {
      console.warn("WARNING: No available rides after filtering.");
    }
  }, [adminUsers, existingRides, availableRides]);

  // Extra debug: Log ride fields and filter values
  useEffect(() => {
    if (Array.isArray(existingRides)) {
      console.log("--- Ride Filter Debug ---");
      console.log("watchFrom:", watchFrom, "watchTo:", watchTo);
      existingRides.forEach((ride, idx) => {
        console.log(`Ride[${idx}]`, {
          from_location: ride.from_location,
          to_location: ride.to_location,
          seats_requested: ride.seats_requested,
          departure_date: ride.departure_date,
        });
      });
      console.log("------------------------");
    }
  }, [existingRides, watchFrom, watchTo]);

  // For prefilledRide, always show seat selection first, then payment
  if (isPrefilledRideValid) {
    if (!form.getValues().passengers || currentStep === "location") {
      return (
        <Card className="w-full mx-auto md:mx-0 max-w-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Book Your Seat
            </h2>
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.getValues().passengers) {
                    toast.error(
                      "Please select the number of seats before continuing."
                    );
                    return;
                  }
                  setCurrentStep("payment");
                }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Seats</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="flex items-center hover:border-black transition-colors rounded-[2rem]">
                            <Users className="mr-2 h-5 w-5 text-gray-500" />
                            <SelectValue placeholder="Select seats" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from(
                            { length: prefilledAvailableSeats || 6 },
                            (_, i) => i + 1
                          ).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "seat" : "seats"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </Card>
      );
    }
    if (currentStep === "payment") {
      const prefilledPrice =
        (typeof prefilledRide.price === "number"
          ? prefilledRide.price
          : parseInt(prefilledRide.price)) *
        (parseInt(form.getValues().passengers) || 1);
      return (
        <Card className="w-full mx-auto md:mx-0 max-w-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Book Your Seat
            </h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="text-lg font-semibold mb-2">
                  Booking Summary
                </div>
                <div className="text-sm text-gray-700">
                  <div>
                    Route:{" "}
                    <b>
                      {prefilledRide.from_location} →{" "}
                      {prefilledRide.to_location}
                    </b>
                  </div>
                  <div>
                    Date: <b>{prefilledRide.departure_date}</b>
                  </div>
                  <div>
                    Time: <b>{prefilledRide.departure_time}</b>
                  </div>
                  <div>
                    Seats: <b>{form.getValues().passengers}</b>
                  </div>
                  <div>
                    Total: <b>₦{prefilledPrice.toLocaleString()}</b>
                  </div>
                </div>
              </div>
              <PaystackPayment
                amount={prefilledPrice}
                email={user?.email || ""}
                onSuccess={handlePrefilledPaymentSuccess}
                onCancel={() => setCurrentStep("location")}
                rideDetails={{
                  from: prefilledRide.from_location,
                  to: prefilledRide.to_location,
                  date: prefilledRide.departure_date,
                  time: prefilledRide.departure_time,
                  passengers: parseInt(form.getValues().passengers) || 1,
                }}
              />
            </div>
          </div>
        </Card>
      );
    }
    // return null;
  }
  // Always render the normal booking flow if no valid prefilledRide
  return (
    <>
      <Card className="w-full mx-auto md:mx-0 max-w-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Book Your Campus Ride
          </h2>

          <Tabs
            value={bookingType}
            onValueChange={(v) => setBookingType(v as BookingType)}
            className="mb-6 rounded-[3.5rem]"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-[2rem]">
              <TabsTrigger
                value="join"
                className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-100 transition-colors rounded-[1.5rem]"
              >
                Book Seat
              </TabsTrigger>
              <TabsTrigger
                value="full"
                className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-100 transition-colors rounded-[1.5rem]"
              >
                Book Entire Ride
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-6">
            <div className="flex justify-between">
              <div
                className={`flex flex-col items-center ${
                  currentStep === "location" ? "text-black" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep === "location"
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  1
                </div>
                <span className="text-xs">Location</span>
              </div>
              <div
                className={`flex flex-col items-center ${
                  currentStep === "date" ? "text-black" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep === "date"
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  2
                </div>
                <span className="text-xs">Date & Time</span>
              </div>
              <div
                className={`flex flex-col items-center ${
                  currentStep === "vehicle" ? "text-black" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep === "vehicle"
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  3
                </div>
                <span className="text-xs">Vehicle</span>
              </div>
              <div
                className={`flex flex-col items-center ${
                  currentStep === "payment" ? "text-black" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep === "payment"
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  4
                </div>
                <span className="text-xs">Payment</span>
              </div>
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{
                  width:
                    currentStep === "location"
                      ? "25%"
                      : currentStep === "date"
                      ? "50%"
                      : currentStep === "vehicle"
                      ? "75%"
                      : "100%",
                }}
              ></div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === "location" && (
                <div className="space-y-6">
                  {/* From Location */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900">
                        <ArrowUpRight className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Departing From
                        </label>
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            type="button"
                            variant={
                              watchFromType === "university"
                                ? undefined
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              toggleLocationType("fromType", "university")
                            }
                            className={`${
                              watchFromType === "university"
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-black"
                            } h-8 px-3 py-1 border rounded-[2rem] hover:bg-black hover:text-white transition-colors duration-200`}
                          >
                            University
                          </Button>
                          <Button
                            type="button"
                            variant={
                              watchFromType === "state" ? undefined : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              toggleLocationType("fromType", "state")
                            }
                            className={`${
                              watchFromType === "state"
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-black"
                            } h-8 px-3 py-1 border rounded-[2rem] hover:bg-black hover:text-white transition-colors duration-200`}
                          >
                            State
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name="from"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-[2rem]">
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                                      <SelectValue
                                        placeholder={`Select departure ${watchFromType}`}
                                      />
                                    </div>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {watchFromType === "university"
                                    ? (enabledUniversities || []).map((loc) => (
                                        <SelectItem key={loc} value={loc}>
                                          {loc}
                                        </SelectItem>
                                      ))
                                    : (enabledStates || []).map((loc) => (
                                        <SelectItem key={loc} value={loc}>
                                          {loc}
                                        </SelectItem>
                                      ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {watchFrom && (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs hover:bg-gray-100 transition-colors"
                          onClick={() => form.setValue("from", "")}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* To Location */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black">
                        <ArrowDownLeft className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Going To
                        </label>
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            type="button"
                            variant={
                              watchToType === "university"
                                ? undefined
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              toggleLocationType("toType", "university")
                            }
                            className={`${
                              watchToType === "university"
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-black"
                            } h-8 px-3 py-1 border rounded-[2rem] hover:bg-black hover:text-white transition-colors duration-200`}
                          >
                            University
                          </Button>
                          <Button
                            type="button"
                            variant={
                              watchToType === "state" ? undefined : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              toggleLocationType("toType", "state")
                            }
                            className={`${
                              watchToType === "state"
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-black"
                            } h-8 px-3 py-1 border rounded-[2rem] hover:bg-black hover:text-white transition-colors duration-200`}
                          >
                            State
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name="to"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-[2rem]">
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                                      <SelectValue
                                        placeholder={`Select destination ${watchToType}`}
                                      />
                                    </div>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {watchToType === "university"
                                    ? (enabledUniversities || []).map((loc) => (
                                        <SelectItem key={loc} value={loc}>
                                          {loc}
                                        </SelectItem>
                                      ))
                                    : (enabledStates || []).map((loc) => (
                                        <SelectItem key={loc} value={loc}>
                                          {loc}
                                        </SelectItem>
                                      ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {watchTo && (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs hover:bg-gray-100 transition-colors"
                          onClick={() => form.setValue("to", "")}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Specific Location for "Book Entire Ride" */}
                  {bookingType === "full" && (watchFrom || watchTo) && (
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="specificLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Specific location in {getStateForLocationSearch()}
                            </FormLabel>
                            <FormControl>
                              <LocationSearchInput
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Enter specific location"
                                stateFilter={getStateForLocationSearch()}
                                className="rounded-[2rem]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-center">
                        <span className="text-sm text-gray-500">OR</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowMapPicker(true)}
                      >
                        <Map className="mr-2 h-4 w-4" />
                        Choose Location on Map
                      </Button>

                      {watchMapLocation && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Map Location Selected:
                              </p>
                              <p className="text-xs text-green-700">
                                {watchMapLocation.address}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs text-green-600 hover:text-green-800 p-0 h-auto"
                                onClick={() =>
                                  form.setValue("mapLocation", undefined)
                                }
                              >
                                Clear map location
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Remove inline preview. Instead, show Preview button if valid */}
                  {isLocationStepValid() && (
                    <div className="flex justify-center mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100"
                        onClick={() => setShowPreviewModal(true)}
                      >
                        <Eye className="h-5 w-5 text-gray-700" />
                        <span>Preview Route</span>
                      </Button>
                    </div>
                  )}

                  {/* Available Rides Info */}
                  {bookingType === "join" &&
                    !ridesLoading &&
                    availableRidesList.length === 0 &&
                    watchFrom &&
                    watchTo && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          No available rides for this route. You'll need to book
                          the entire ride.
                        </p>
                      </div>
                    )}

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-black text-white hover:bg-gray-900"
                    disabled={!isLocationStepValid()}
                  >
                    Next
                  </Button>
                </div>
              )}

              {currentStep === "date" && (
                <div className="space-y-4">
                  {/* Date Selection */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Travel Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full bg-white flex justify-between items-center pl-3 text-left font-normal hover:bg-gray-50 transition-colors ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </div>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time Selection */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="flex items-center hover:border-black transition-colors rounded-[2rem]">
                              <Clock className="mr-2 h-5 w-5 text-gray-500" />
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(
                              availableTimes || [
                                "08:00",
                                "12:00",
                                "14:00",
                                "18:00",
                              ]
                            ).map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Passengers - only show for join rides */}
                  {bookingType === "join" && (
                    <FormField
                      control={form.control}
                      name="passengers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Passengers</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={!!prefilledRide}
                          >
                            <FormControl>
                              <SelectTrigger className="flex items-center hover:border-black transition-colors rounded-[2rem]">
                                <Users className="mr-2 h-5 w-5 text-gray-500" />
                                <SelectValue placeholder="Select passengers" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from(
                                { length: prefilledAvailableSeats || 6 },
                                (_, i) => i + 1
                              ).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "passenger" : "passengers"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {bookingType === "full" && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You're booking the entire vehicle. Number of passengers
                        will be determined by the vehicle capacity.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="w-1/2"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-1/2 bg-black text-white hover:bg-gray-900"
                      disabled={!isDateStepValid}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === "vehicle" && (
                <div className="space-y-4">
                  <FormLabel>Select Vehicle</FormLabel>
                  {filteredVehicles.length === 0 ? (
                    <div className="p-4 border rounded-lg bg-orange-50 text-orange-800 text-center">
                      No vehicles available for this route. Please select a
                      different route.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredVehicles.map((vehicle) => {
                        const isSelected = watchVehicleId === vehicle.id;
                        // Get per-vehicle price for this route
                        let perVehiclePrice = getRouteVehiclePrice(
                          watchFromType,
                          watchFrom,
                          watchToType,
                          watchTo,
                          vehicle.name
                        );
                        let priceSource = "route_vehicle_pricing";
                        // Fallbacks
                        if (!perVehiclePrice) {
                          perVehiclePrice = getRouteAdminPrice(
                            watchFromType,
                            watchFrom,
                            watchToType,
                            watchTo,
                            vehicle.name
                          );
                          priceSource = "route_pricing";
                        }
                        if (!perVehiclePrice) {
                          perVehiclePrice = vehicle.base_price;
                          priceSource = "vehicle_base_price";
                        }
                        // Per-seat price for join bookings
                        const perSeatPrice = Math.round(
                          perVehiclePrice / vehicle.capacity
                        );
                        return (
                          <div
                            key={vehicle.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected
                                ? "border-black bg-gray-100"
                                : "hover:border-gray-300 border-gray-200"
                            }`}
                            onClick={() =>
                              form.setValue("vehicleId", vehicle.id)
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-lg">
                                {vehicle.name}
                              </div>
                              {isSelected && (
                                <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                  Selected
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                              Capacity: {vehicle.capacity} passengers
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                              {bookingType === "full" ? (
                                <>
                                  Vehicle Price: ₦
                                  {perVehiclePrice.toLocaleString()} <br />
                                  <span className="text-xs text-green-700">
                                    10% discount for full ride
                                  </span>
                                </>
                              ) : (
                                <>
                                  Per Seat: ₦{perSeatPrice.toLocaleString()}{" "}
                                  <span className="text-xs text-gray-500">
                                    ({priceSource})
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="text-xs text-blue-700 mt-1">
                              {/* Price source: {priceSource} */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {calculatedPrice > 0 && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-lg font-semibold">
                        Total: ₦{calculatedPrice.toLocaleString()}
                        {bookingType === "full" && (
                          <span className="text-sm text-green-600 block">
                            10% discount applied!
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="w-1/2"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-1/2 bg-black text-white hover:bg-gray-900"
                      disabled={!watchVehicleId}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === "payment" &&
                calculatedPrice > 0 &&
                watchVehicleId && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-lg font-semibold">
                        Total: ₦{calculatedPrice.toLocaleString()}
                        {bookingType === "full" && (
                          <span className="text-sm text-green-600 block">
                            10% discount applied!
                          </span>
                        )}
                      </div>
                    </div>
                    <PaystackPayment
                      amount={calculatedPrice}
                      email={user?.email || ""}
                      onSuccess={(reference) =>
                        handlePaymentSuccess(reference, true)
                      }
                      onCancel={prevStep}
                      rideDetails={{
                        from: form.getValues().from,
                        to: form.getValues().to,
                        date: format(form.getValues().date, "PPP"),
                        time: form.getValues().time,
                        passengers:
                          bookingType === "full"
                            ? vehicles.find(
                                (v) => v.id === form.getValues().vehicleId
                              )?.capacity || 1
                            : parseInt(form.getValues().passengers) || 1,
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="w-1/2"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
            </form>
          </Form>
        </div>
      </Card>

      {/* Map Location Picker Modal */}
      {showMapPicker && (
        <MapLocationPicker
          onLocationSelect={handleMapLocationSelect}
          onClose={() => setShowMapPicker(false)}
          initialLocation={getStateForLocationSearch()}
        />
      )}

      {/* Route Preview Modal (user controlled) */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            key="preview-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full relative">
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowPreviewModal(false)}
                aria-label="Close preview"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
              <h3 className="text-lg font-semibold mb-4 text-center">
                Route Preview
              </h3>
              <RoutePreview
                from={watchFrom}
                to={watchTo}
                fromType={watchFromType}
                toType={watchToType}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Add getLocationType helper (copied from RideBookingForm.tsx)
const getLocationType = (value: string): "university" | "state" | null => {
  const universities = [
    "Babcock University, Ilishan-Remo",
    "Afe Babalola University, Ado-Ekiti",
    "Redeemer's University, Ede",
    "Covenant University, Ota",
    "Bowen University, Iwo",
    "Lead City University, Ibadan",
    "Pan-Atlantic University, Lagos",
    "Landmark University, Omu-Aran",
    "American University of Nigeria, Yola",
  ];
  const states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];
  if (universities.includes(value)) return "university";
  if (states.includes(value)) return "state";
  return null;
};

export default RideBookingFormNew;
