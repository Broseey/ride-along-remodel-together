import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MapPin, ArrowRight, ArrowLeft, University, Flag } from "lucide-react";

// List of Nigerian universities and states that we operate from
const nigerianLocations = {
  universities: [
    "Babcock University, Ilishan-Remo",
    "Afe Babalola University, Ado-Ekiti",
    "Redeemer's University, Ede",
    "Covenant University, Ota",
    "Bowen University, Iwo",
    "Lead City University, Ibadan",
    "Pan-Atlantic University, Lagos",
    "Landmark University, Omu-Aran",
    "American University of Nigeria, Yola"
  ],
  states: [
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
    "Zamfara"
  ]
};

interface LocationSearchProps {
  type: "from" | "to";
  value: string;
  onChange: (value: string) => void;
  otherLocationType?: "university" | "state" | null;
}

const LocationSearch = ({ type, value, onChange, otherLocationType }: LocationSearchProps) => {
  const [locationType, setLocationType] = useState<"university" | "state">(
    otherLocationType ? (otherLocationType === "university" ? "state" : "university") : "university"
  );
  
  // Effect to ensure the location types are complementary (one university, one state)
  useEffect(() => {
    if (otherLocationType) {
      setLocationType(otherLocationType === "university" ? "state" : "university");
    }
  }, [otherLocationType]);

  // Get the location type from a value
  const getLocationType = (val: string): "university" | "state" | null => {
    if (nigerianLocations.universities.includes(val)) return "university";
    if (nigerianLocations.states.includes(val)) return "state";
    return null;
  };
  
  // When the user selects a value, update the parent
  const handleValueChange = (val: string) => {
    onChange(val);
  };
  
  return (
    <div className="relative space-y-3">
      <div className="flex items-center space-x-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-[3rem] ${type === "from" ? "bg-black" : "bg-gray-800"}`}>
          {type === "from" ? (
            <ArrowRight className="h-4 w-4 text-white" />
          ) : (
            <ArrowLeft className="h-4 w-4 text-gray-300" />
          )}
        </div>
        
        <div className="flex-1">
          <label htmlFor={`location-${type}`} className="block text-sm font-medium text-gray-900 mb-1">
            {type === "from" ? "Departing From" : "Going To"}
          </label>
          
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant={locationType === "university" ? undefined : "outline"} 
              size="sm"
              onClick={() => {
                if (otherLocationType !== "university") {
                  setLocationType("university");
                  onChange(""); // Clear the selection when changing type
                }
              }}
              disabled={otherLocationType === "university"}
              className={`${locationType === "university" ? "bg-black text-white border-black" : "bg-white text-black border-black"} h-8 px-3 py-1 border rounded-[3rem] hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <University className={`h-4 w-4 mr-1 ${locationType === "university" ? "text-white" : "text-black"}`} />
              University
            </Button>
            <Button 
              variant={locationType === "state" ? undefined : "outline"} 
              size="sm"
              onClick={() => {
                if (otherLocationType !== "state") {
                  setLocationType("state");
                  onChange(""); // Clear the selection when changing type
                }
              }}
              disabled={otherLocationType === "state"}
              className={`${locationType === "state" ? "bg-black text-white border-black" : "bg-white text-black border-black"} h-8 px-3 py-1 border rounded-[3rem] hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Flag className={`h-4 w-4 mr-1 ${locationType === "state" ? "text-white" : "text-black"}`} />
              State
            </Button>
          </div>
          
          <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger id={`location-${type}`} className="w-full">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                <SelectValue placeholder={type === "from" ? `Select departure ${locationType}` : `Select destination ${locationType}`} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {locationType === "university" ? (
                nigerianLocations.universities.map((university) => (
                  <SelectItem key={university} value={university}>
                    {university}
                  </SelectItem>
                ))
              ) : (
                nigerianLocations.states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {value && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
