import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@shared/integrations/supabase/client";
import { toast } from "sonner";

export const useRides = () => {
  const queryClient = useQueryClient();

  // Fetch rides for the current user
  const {
    data: rides,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["rides"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create a new ride
  const createRide = useMutation({
    mutationFn: async (rideData: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("rides")
        .insert({
          ...rideData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      toast.success("Ride created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create ride");
      console.error("Error creating ride:", error);
    },
  });

  // Update ride status
  const updateRideStatus = useMutation({
    mutationFn: async ({
      rideId,
      status,
    }: {
      rideId: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("rides")
        .update({ status })
        .eq("id", rideId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      toast.success("Ride status updated");
    },
    onError: (error) => {
      toast.error("Failed to update ride status");
      console.error("Error updating ride status:", error);
    },
  });

  return {
    rides,
    isLoading,
    error,
    refetch,
    createRide,
    updateRideStatus,
  };
};
