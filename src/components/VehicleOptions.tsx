import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  image?: string;
  capacity: number;
  price: number;
  features?: string[];
}

interface VehicleOptionsProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onSelect: (id: string) => void;
  bookingType?: "join" | "full";
}

const VehicleOptions = ({
  vehicles,
  selectedVehicle,
  onSelect,
  bookingType = "join",
}: VehicleOptionsProps) => {
  const calculatePrice = (vehicle: Vehicle) => {
    if (bookingType === "full") {
      // 10% discount for full ride booking
      return Math.round(vehicle.price * 0.9);
    }
    // Per seat pricing for join rides
    return Math.round(vehicle.price / vehicle.capacity);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          className={`p-4 cursor-pointer transition-all rounded-lg ${
            selectedVehicle === vehicle.id
              ? "border-blue-600 bg-blue-50"
              : "hover:border-gray-300 border-gray-200"
          }`}
          onClick={() => onSelect(vehicle.id)}
        >
          <div className="flex items-start">
            {vehicle.image && (
              <div className="text-3xl mr-3">{vehicle.image}</div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                {selectedVehicle === vehicle.id && (
                  <div className="bg-blue-600 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {vehicle.capacity} passengers
              </div>
              {vehicle.features && (
                <div className="text-xs text-gray-600 mb-3">
                  {vehicle.features.join(" • ")}
                </div>
              )}
              <div className="font-bold text-blue-700">
                ₦{calculatePrice(vehicle).toLocaleString()}
                {bookingType === "join" && (
                  <span className="text-xs text-gray-500 font-normal">
                    {" "}
                    /seat
                  </span>
                )}
                {bookingType === "full" && (
                  <span className="text-xs text-green-600 font-normal">
                    {" "}
                    (10% off)
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VehicleOptions;
