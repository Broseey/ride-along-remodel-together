
import { MapPin, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PriceEstimateProps {
  rideType: string;
  pickup: string;
  destination: string;
  onBook: () => void;
  onBack: () => void;
}

const PriceEstimate = ({ rideType, pickup, destination, onBook, onBack }: PriceEstimateProps) => {
  const prices = {
    Economy: { base: 8, total: 12 },
    Premium: { base: 12, total: 18 },
    Luxury: { base: 18, total: 25 }
  };

  const price = prices[rideType as keyof typeof prices] || prices.Economy;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Trip Summary</h2>
        <p className="text-sm text-muted-foreground">{rideType} ride</p>
      </div>

      {/* Route */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium">Pickup</p>
            <p className="text-sm text-muted-foreground">{pickup}</p>
          </div>
        </div>
        
        <div className="ml-2.5 border-l-2 border-dashed border-muted h-8"></div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium">Destination</p>
            <p className="text-sm text-muted-foreground">{destination}</p>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Estimated time: 15-20 min</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Distance: 5.2 miles</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold">Price Breakdown</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base fare</span>
            <span>${price.base}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>$2</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>$2</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${price.total}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
        <CreditCard className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">•••• 1234</span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button onClick={onBook} className="w-full h-12 text-lg">
          Book {rideType} - ${price.total}
        </Button>
        <Button onClick={onBack} variant="outline" className="w-full">
          Back to ride options
        </Button>
      </div>
    </div>
  );
};

export default PriceEstimate;
