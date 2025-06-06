
import { useState } from "react";
import { MapPin, Clock, Car } from "lucide-react";
import LocationInput from "./LocationInput";
import RideTypeCard from "./RideTypeCard";
import PriceEstimate from "./PriceEstimate";
import DriverMatch from "./DriverMatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type BookingStep = "input" | "select" | "estimate" | "booking";

const RideBooking = () => {
  const [step, setStep] = useState<BookingStep>("input");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState("");

  const handleLocationSubmit = () => {
    if (pickup && destination) {
      setStep("select");
    }
  };

  const handleRideSelect = (rideType: string) => {
    setSelectedRide(rideType);
    setStep("estimate");
  };

  const handleBookRide = () => {
    setStep("booking");
  };

  const resetBooking = () => {
    setStep("input");
    setPickup("");
    setDestination("");
    setSelectedRide("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Car className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-primary">RideApp</h1>
        </div>
        <p className="text-muted-foreground">Your ride, wherever you need to go</p>
      </div>

      {/* Main Card */}
      <Card className="p-6 shadow-lg">
        {step === "input" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Where to?</h2>
              <p className="text-sm text-muted-foreground">Enter your pickup and destination</p>
            </div>
            
            <LocationInput
              label="Pickup Location"
              placeholder="Current location"
              value={pickup}
              onChange={setPickup}
              icon={<MapPin className="h-4 w-4" />}
            />
            
            <LocationInput
              label="Destination"
              placeholder="Where are you going?"
              value={destination}
              onChange={setDestination}
              icon={<MapPin className="h-4 w-4 text-green-600" />}
            />
            
            <Button 
              onClick={handleLocationSubmit}
              disabled={!pickup || !destination}
              className="w-full h-12 text-lg"
            >
              Find Rides
            </Button>
          </div>
        )}

        {step === "select" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Choose your ride</h2>
              <p className="text-sm text-muted-foreground">From {pickup} to {destination}</p>
            </div>
            
            <RideTypeCard
              type="Economy"
              description="Affordable rides"
              price="$12"
              time="5 min"
              selected={selectedRide === "Economy"}
              onClick={() => handleRideSelect("Economy")}
            />
            
            <RideTypeCard
              type="Premium"
              description="Comfortable rides"
              price="$18"
              time="3 min"
              selected={selectedRide === "Premium"}
              onClick={() => handleRideSelect("Premium")}
            />
            
            <RideTypeCard
              type="Luxury"
              description="Premium experience"
              price="$25"
              time="4 min"
              selected={selectedRide === "Luxury"}
              onClick={() => handleRideSelect("Luxury")}
            />
            
            <Button 
              onClick={() => setStep("input")}
              variant="outline"
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}

        {step === "estimate" && (
          <PriceEstimate
            rideType={selectedRide}
            pickup={pickup}
            destination={destination}
            onBook={handleBookRide}
            onBack={() => setStep("select")}
          />
        )}

        {step === "booking" && (
          <DriverMatch
            rideType={selectedRide}
            onReset={resetBooking}
          />
        )}
      </Card>
    </div>
  );
};

export default RideBooking;
