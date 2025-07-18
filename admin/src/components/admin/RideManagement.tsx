import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Badge } from "@shared/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@shared/integrations/supabase/client";
import { format } from "date-fns";

const RideManagement = () => {
  const { data: rides, isLoading } = useQuery({
    queryKey: ["admin-rides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rides")
        .select(
          `
          *,
          profiles!rides_user_id_fkey(full_name, email)
        `
        )
        .order("departure_date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Group rides
  const now = new Date();
  const activeStatuses = ["pending", "confirmed", "available"];
  const completedStatuses = ["completed"];
  const cancelledStatuses = ["cancelled"];

  const activeRides =
    rides?.filter(
      (r) =>
        activeStatuses.includes(r.status) && new Date(r.departure_date) >= now
    ) || [];
  const completedRides =
    rides?.filter((r) => completedStatuses.includes(r.status)) || [];
  const cancelledRides =
    rides?.filter((r) => cancelledStatuses.includes(r.status)) || [];
  const nextRide = activeRides.length > 0 ? activeRides[0] : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      case "available":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <div>Loading rides...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Rides</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-col items-center px-4 py-2 bg-blue-100 rounded">
            <span className="text-lg font-bold text-blue-800">
              {activeRides.length}
            </span>
            <span className="text-xs text-blue-700">Active</span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 bg-green-100 rounded">
            <span className="text-lg font-bold text-green-800">
              {completedRides.length}
            </span>
            <span className="text-xs text-green-700">Completed</span>
          </div>
          <div
            className="flex flex-col items-center px-4 py-2 bg-gray-100 rounded"
            title="Users cannot cancel rides yet. Only admins or system actions can mark rides as cancelled."
          >
            <span className="text-lg font-bold text-gray-800">
              {cancelledRides.length}
            </span>
            <span className="text-xs text-gray-700">Cancelled</span>
          </div>
        </div>
        {nextRide && (
          <div className="mb-6 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-bold mb-2">Next to Go</h3>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusColor(nextRide.status)}>
                {nextRide.status}
              </Badge>
              <span>
                {nextRide.from_location} → {nextRide.to_location}
              </span>
              <span>
                {format(new Date(nextRide.departure_date), "MMM dd, yyyy")}
              </span>
              <span>{nextRide.departure_time}</span>
            </div>
          </div>
        )}
        <h3 className="font-semibold mt-4 mb-2">Current/Active Rides</h3>
        {activeRides.length === 0 ? (
          <p className="text-gray-500 mb-4">No active rides.</p>
        ) : (
          activeRides.map((ride) => (
            <div key={ride.id} className="border rounded-lg p-4 mb-2">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusColor(ride.status)}>
                  {ride.status}
                </Badge>
                <span>
                  {ride.from_location} → {ride.to_location}
                </span>
                <span>
                  {format(new Date(ride.departure_date), "MMM dd, yyyy")}
                </span>
                <span>{ride.departure_time}</span>
              </div>
            </div>
          ))
        )}
        <h3 className="font-semibold mt-6 mb-2">Completed Rides</h3>
        {completedRides.length === 0 ? (
          <p className="text-gray-500 mb-4">No completed rides.</p>
        ) : (
          completedRides.map((ride) => (
            <div key={ride.id} className="border rounded-lg p-4 mb-2">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusColor(ride.status)}>
                  {ride.status}
                </Badge>
                <span>
                  {ride.from_location} → {ride.to_location}
                </span>
                <span>
                  {format(new Date(ride.departure_date), "MMM dd, yyyy")}
                </span>
                <span>{ride.departure_time}</span>
              </div>
            </div>
          ))
        )}
        <h3 className="font-semibold mt-6 mb-2">Cancelled/Forfeited Rides</h3>
        {cancelledRides.length === 0 ? (
          <p className="text-gray-500 mb-4">No cancelled rides.</p>
        ) : (
          cancelledRides.map((ride) => (
            <div key={ride.id} className="border rounded-lg p-4 mb-2">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusColor(ride.status)}>
                  {ride.status}
                </Badge>
                <span>
                  {ride.from_location} → {ride.to_location}
                </span>
                <span>
                  {format(new Date(ride.departure_date), "MMM dd, yyyy")}
                </span>
                <span>{ride.departure_time}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RideManagement;
