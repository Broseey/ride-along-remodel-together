import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LocationSearch from "@/components/LocationSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/components/ui/tabs";
import { MapPin, Calendar, Car, Users } from "lucide-react";

type BookingStep = "location" | "date" | "vehicle";

const vehicles = [
  { id: "sienna", name: "Sienna", capacity: 6, price: 5000 },
  { id: "hiace", name: "Hiace Bus", capacity: 14, price: 7000 },
  { id: "long-bus", name: "Long Bus", capacity: 18, price: 8000 },
  { id: "corolla", name: "Corolla", capacity: 4, price: 3500 },
];

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

const RideBookingForm = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("location");
  const [bookingType, setBookingType] = useState<"join" | "full">("join");
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: "1",
    vehicleId: "",
  });

  const fromLocationType = useMemo(
    () => getLocationType(formData.from),
    [formData.from]
  );
  const toLocationType = useMemo(
    () => getLocationType(formData.to),
    [formData.to]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    if (currentStep === "location") setCurrentStep("date");
    else if (currentStep === "date") setCurrentStep("vehicle");
  };

  const prevStep = () => {
    if (currentStep === "vehicle") setCurrentStep("date");
    else if (currentStep === "date") setCurrentStep("location");
  };

  const handleSubmit = () => {
    console.log("Booking submitted:", { bookingType, ...formData });
    window.location.href = "/booking-confirmation";
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

  const isLocationStepValid =
    formData.from &&
    formData.to &&
    ((fromLocationType === "university" && toLocationType === "state") ||
      (fromLocationType === "state" && toLocationType === "university"));

  return (
    <Card className="w-full max-w-md shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Book Your Campus Ride
        </h2>

        <Tabs
          value={bookingType}
          onValueChange={(v) => setBookingType(v as "join" | "full")}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join a Ride</TabsTrigger>
            <TabsTrigger value="full">Book Full Vehicle</TabsTrigger>
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
                }`}
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
                  currentStep === "date" ? "bg-black text-white" : "bg-gray-200"
                }`}
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
                }`}
              >
                3
              </div>
              <span className="text-xs">Vehicle</span>
            </div>
          </div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{
                width:
                  currentStep === "location"
                    ? "33.3%"
                    : currentStep === "date"
                    ? "66.6%"
                    : "100%",
              }}
            ></div>
          </div>
        </div>

        {currentStep === "location" && (
          <div className="space-y-6">
            <LocationSearch
              type="from"
              value={formData.from}
              otherLocationType={toLocationType}
              onChange={(value) => handleSelectChange("from", value)}
            />
            <LocationSearch
              type="to"
              value={formData.to}
              otherLocationType={fromLocationType}
              onChange={(value) => handleSelectChange("to", value)}
            />

            {formData.from && formData.to && !isLocationStepValid && (
              <div className="text-destructive text-sm mt-2">
                You must select a university for one location and a state for
                the other.
              </div>
            )}

            <Button
              onClick={nextStep}
              className="w-full bg-black text-white hover:bg-gray-900"
              disabled={!isLocationStepValid}
            >
              Next
            </Button>
          </div>
        )}

        {currentStep === "date" && (
          <div className="space-y-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className="pl-3"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Select
                value={formData.passengers}
                onValueChange={(value) =>
                  handleSelectChange("passengers", value)
                }
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Number of passengers" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "passenger" : "passengers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep} className="w-1/2">
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="w-1/2"
                disabled={!formData.date || !formData.time}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === "vehicle" && (
          <div className="space-y-4">
            <div className="relative">
              <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Select
                value={formData.vehicleId}
                onValueChange={(value) =>
                  handleSelectChange("vehicleId", value)
                }
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - {vehicle.capacity} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedVehicle && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold">{selectedVehicle.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Capacity: {selectedVehicle.capacity} passengers</p>
                  <p>Price: ₦{selectedVehicle.price.toLocaleString()}</p>
                  {bookingType === "join" && (
                    <p>
                      Your Price: ₦
                      {Math.round(
                        selectedVehicle.price / selectedVehicle.capacity
                      ).toLocaleString()}{" "}
                      per person
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep} className="w-1/2">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="w-1/2 bg-black text-white hover:bg-gray-900"
                disabled={!formData.vehicleId}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RideBookingForm;
