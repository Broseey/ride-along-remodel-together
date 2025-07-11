import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Badge } from "@shared/components/ui/badge";
import { Calendar, Clock, Users, Car, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@shared/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminAvailableRides = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: availableRides, isLoading } = useQuery({
    queryKey: ["admin-available-rides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rides")
        .select(
          `
          *,
          profiles!rides_user_id_fkey(full_name, email)
        `
        )
        .in("status", ["available", "pending"])
        .order("departure_date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const deleteRide = useMutation({
    mutationFn: async (rideId: string) => {
      const { error } = await supabase.from("rides").delete().eq("id", rideId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-available-rides"] });
      toast.success("Ride deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete ride");
      console.error("Error deleting ride:", error);
    },
  });

  const handleDelete = (rideId: string) => {
    setDeleteId(rideId);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteRide.mutate(deleteId);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading available rides...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Available Rides ({availableRides?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!availableRides || availableRides.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p>No available rides yet. Create a new ride to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableRides.map((ride) => (
              <div
                key={ride.id}
                className="border rounded-[3.5rem] md:rounded-[4.0rem] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="default">{ride.status}</Badge>
                    <div>
                      <h3 className="font-medium">
                        {ride.from_location} → {ride.to_location}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created by: {ride.profiles?.full_name || "Admin"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(ride.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(new Date(ride.departure_date), "MMM dd, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{ride.departure_time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{ride.seats_requested} seats</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      ₦{ride.price?.toLocaleString() || "TBD"}
                    </span>
                  </div>
                </div>

                {ride.pickup_location && (
                  <div className="text-sm">
                    <span className="font-medium">Pickup: </span>
                    <span className="text-gray-600">
                      {ride.pickup_location}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-lg font-bold mb-4">
                Are you sure you want to delete/forfeit this ride?
              </h3>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAvailableRides;
