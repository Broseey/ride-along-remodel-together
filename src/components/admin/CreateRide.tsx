import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm, Controller } from "react-hook-form";

// 1. Define the form data type
interface CreateRideFormData {
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  totalSeats: string;
  price: string;
  vehicleType: string;
  description: string;
}

const CreateRide = () => {
  const queryClient = useQueryClient();

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

  // Use the correct type for the mutation argument
  const createRide = useMutation({
    mutationFn: async (data: CreateRideFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      // Defensive: Accept both YYYY-MM-DD and DD-MM-YY(YY) formats
      let isoDate = data.departureDate;
      if (/^\d{2}-\d{2}-\d{2,4}$/.test(data.departureDate)) {
        const [day, month, yearRaw] = data.departureDate.split("-");
        const year = yearRaw.length === 2 ? "20" + yearRaw : yearRaw;
        isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      const {
        fromLocation,
        toLocation,
        price,
        vehicleType,
        description,
        departureTime,
      } = data;
      const { data: rideData, error } = await supabase
        .from("rides")
        .insert({
          from_location: fromLocation,
          to_location: toLocation,
          departure_date: isoDate,
          departure_time: departureTime,
          price: Number(price),
          booking_type: "join",
          status: "pending",
          seats_requested: 0,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return rideData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rides"] });
      queryClient.invalidateQueries({ queryKey: ["available-rides"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Ride created successfully! Users can now book seats.");
      reset(); // <-- reset the form after successful creation
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create ride");
      }
    },
  });

  const {
    control,
    handleSubmit,
    reset, // <-- add reset here
    formState: { isSubmitting },
  } = useForm<CreateRideFormData>({
    defaultValues: {
      fromLocation: "",
      toLocation: "",
      departureDate: "",
      departureTime: "",
      totalSeats: "",
      price: "",
      vehicleType: "",
      description: "",
    },
  });

  // Use the correct type for onSubmit
  const onSubmit = (data: CreateRideFormData) => {
    createRide.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Ride
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromLocation">From Location *</Label>
              <Controller
                name="fromLocation"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select from location" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="font-semibold px-2 py-1 text-sm">
                        States
                      </div>
                      {enabledStates?.map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                      <div className="font-semibold px-2 py-1 text-sm border-t mt-2 pt-2">
                        Universities
                      </div>
                      {enabledUniversities?.map((uni: string) => (
                        <SelectItem key={uni} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toLocation">To Location *</Label>
              <Controller
                name="toLocation"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select to location" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="font-semibold px-2 py-1 text-sm">
                        States
                      </div>
                      {enabledStates?.map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                      <div className="font-semibold px-2 py-1 text-sm border-t mt-2 pt-2">
                        Universities
                      </div>
                      {enabledUniversities?.map((uni: string) => (
                        <SelectItem key={uni} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate">Departure Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="departureDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="departureDate"
                      type="date"
                      className="pl-10"
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureTime">Departure Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="departureTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="departureTime"
                      type="time"
                      className="pl-10"
                      required
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalSeats">Total Seats *</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="totalSeats"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="totalSeats"
                      type="number"
                      min="1"
                      max="20"
                      placeholder="6"
                      className="pl-10"
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Seat (₦) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="1200"
                      className="pl-10"
                      required
                    />
                  )}
                />
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  This is the price per seat, as set by admin. Riders will see
                  this exact price.
                </p>
              </div>
            </div>

            {/* Restrict vehicleType select to admin-specified types only */}
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Coaster bus">Coaster bus</SelectItem>
                      <SelectItem value="Hiace Bus">Hiace Bus</SelectItem>
                      <SelectItem value="Sienna">Sienna</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Additional details about the ride..."
                  rows={3}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createRide.isPending}
          >
            {isSubmitting || createRide.isPending
              ? "Creating Ride..."
              : "Create Ride"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRide;
