
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  image: string;
  capacity: number;
  price: number;
  features: string[];
}

interface VehicleOptionsProps {
  selectedVehicle: string;
  onSelect: (id: string) => void;
}

const vehicles: Vehicle[] = [
  {
    id: "sienna",
    name: "Toyota Sienna",
    image: "🚐",
    capacity: 6,
    price: 5000,
    features: ["Air Conditioning", "Comfortable Seating", "Luggage Space"]
  },
  {
    id: "hiace",
    name: "Hiace Bus",
    image: "🚌",
    capacity: 14,
    price: 7000,
    features: ["Spacious Interior", "Air Conditioning", "Large Luggage Space"]
  },
  {
    id: "long-bus",
    name: "Long Bus",
    image: "🚍",
    capacity: 18,
    price: 8000,
    features: ["Maximum Capacity", "Economic Option", "Group Friendly"]
  },
  {
    id: "corolla",
    name: "Toyota Corolla",
    image: "🚗",
    capacity: 4,
    price: 3500,
    features: ["Comfort", "Speed", "Fuel Efficiency"]
  }
];

const VehicleOptions = ({ selectedVehicle, onSelect }: VehicleOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      {vehicles.map((vehicle) => (
        <Card 
          key={vehicle.id}
          className={`p-4 cursor-pointer transition-all rounded-[3.5rem] md:rounded-[5.5rem] ${
            selectedVehicle === vehicle.id 
              ? "border-purple-600 bg-purple-50"
              : "hover:border-gray-300"
          }`}
          onClick={() => onSelect(vehicle.id)}
        >
          <div className="flex items-start">
            <div className="text-4xl mr-4">{vehicle.image}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{vehicle.name}</h3>
                {selectedVehicle === vehicle.id && (
                  <div className="bg-purple-600 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {vehicle.capacity} passengers
              </div>
              <div className="mt-2">
                <ul className="text-xs text-gray-600">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 font-semibold text-purple-700">
                ₦{vehicle.price.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VehicleOptions;
