import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  stateFilter?: string;
  className?: string;
  showCurrentLocationButton?: boolean;
}

// Static/campus locations for fallback or supplement
const staticLocations: Record<string, string[]> = {
  Lagos: [
    "University of Lagos",
    "Yaba College of Technology",
    "Victoria Island",
    "Ikeja",
    "Lekki",
    "Ajah",
    "Yaba",
    "Surulere",
    "Magodo",
    "Gbagada",
    "Maryland",
    "Ikoyi",
    "Oshodi",
    "Alaba Market",
    "Mile 2",
    "Badagry",
    "Festac Town",
    "Apapa",
    "Isolo",
    "Ojodu",
    "Berger",
    "Lagos Island",
    "Banana Island",
    "Mushin",
    "Ojo",
    "Epe",
    "Ikorodu",
  ],
  Abuja: [
    "University of Abuja",
    "Maitama",
    "Asokoro",
    "Wuse",
    "Garki",
    "Gwarinpa",
    "Kubwa",
    "Karu",
    "Nyanya",
    "Central Business District",
    "Jabi",
    "Utako",
    "Gudu",
    "Lokogoma",
    "Lugbe",
    "Gwagwalada",
    "Airport Road",
    "Berger",
    "Dutse",
    "Bwari",
    "Suleja",
  ],
  Rivers: [
    "University of Port Harcourt",
    "Port Harcourt",
    "Obio-Akpor",
    "Eleme",
    "Ikwerre",
    "Emohua",
    "Etche",
    "Oyigbo",
    "Trans Amadi",
    "Mile 1",
    "Mile 2",
    "Mile 3",
    "Diobu",
    "GRA Phase 1",
    "GRA Phase 2",
    "Ada George",
    "Rumuola",
    "Rumukrushi",
    "Choba",
    "Aluu",
    "Igwuruta",
  ],
  Kano: [
    "Bayero University Kano",
    "Fagge",
    "Dala",
    "Gwale",
    "Kano Municipal",
    "Nasarawa",
    "Tarauni",
    "Ungogo",
    "Sabon Gari",
    "Kumbotso",
    "Bichi",
    "Bagwai",
    "Dawakin Kudu",
    "Gaya",
    "Gezawa",
    "Kiru",
    "Karaye",
    "Kibiya",
    "Rano",
    "Rimin Gado",
    "Shanono",
  ],
  Oyo: [
    "University of Ibadan",
    "Ibadan North",
    "Ibadan South",
    "Egbeda",
    "Lagelu",
    "Ido",
    "Oluyole",
    "Akinyele",
    "Ona Ara",
    "Ibadan North East",
    "Ibadan North West",
    "Ibadan South East",
    "Ibadan South West",
    "Bodija",
    "Ring Road",
    "Challenge",
    "Mokola",
    "Agodi",
    "Dugbe",
    "Eleyele",
    "Sango",
  ],
  // Add more as needed
};

// Refactored to use Mapbox Places API for real-time suggestions
const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  value,
  onChange,
  placeholder,
  stateFilter,
  className = "",
  showCurrentLocationButton = false,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSuggestions = async () => {
      let staticSuggestions: string[] = [];
      if (value.length >= 2 && stateFilter) {
        // Static/campus suggestions
        staticSuggestions = (staticLocations[stateFilter] || []).filter((loc) =>
          loc.toLowerCase().includes(value.toLowerCase())
        );
        try {
          const accessToken =
            "pk.eyJ1IjoiYnJvc2VleSIsImEiOiJjbWJnN3R1YWgxZWtoMm1xbmR6bm11bWY5In0.gLsCXIOidwX7evIAUbhIqg";
          const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json`;
          // Nigerian state centers for proximity bias
          const stateCenters: Record<string, [number, number]> = {
            Lagos: [3.3792, 6.5244],
            Abuja: [7.4951, 9.0579],
            Rivers: [7.0134, 4.8436],
            Kano: [8.5167, 12.0022],
            Oyo: [3.9394, 7.3775],
            // Add more as needed
          };
          const proximity = stateCenters[stateFilter] || [3.3792, 6.5244]; // Default to Lagos
          // Use types for more relevant results
          const types = "place,locality,neighborhood,address";
          const url = `${endpoint}?access_token=${accessToken}&country=NG&limit=5&proximity=${proximity[0]},${proximity[1]}&types=${types}`;
          const response = await fetch(url);
          let fetchedSuggestions: string[] = [];
          if (response.ok) { 
            const data = await response.json();
            if (data.features) {
              type MapboxFeature = { place_name: string };
              fetchedSuggestions = data.features.map(
                (feature: MapboxFeature) => feature.place_name
              );
            }
          }
          // Combine static and Mapbox, prioritize static, remove duplicates
          const combined = [
            ...staticSuggestions,
            ...fetchedSuggestions.filter((s) => !staticSuggestions.includes(s)),
          ];
          if (isMounted) {
            setSuggestions(combined);
            setShowSuggestions(combined.length > 0);
          }
        } catch (err) {
          if (isMounted) {
            setSuggestions(staticSuggestions);
            setShowSuggestions(staticSuggestions.length > 0);
          }
        }
      } else {
        if (isMounted) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    };
    fetchSuggestions();
    return () => {
      isMounted = false;
    };
  }, [value, stateFilter]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  // Helper to get current location and reverse geocode
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Use Mapbox reverse geocoding
        const accessToken =
          "pk.eyJ1IjoiYnJvc2VleSIsImEiOiJjbWJnN3R1YWgxZWtoMm1xbmR6bm11bWY5In0.gLsCXIOidwX7evIAUbhIqg";
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}&country=NG&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.features && data.features.length > 0) {
          onChange(data.features[0].place_name);
        } else {
          alert("Could not determine your location name.");
        }
      },
      (err) => {
        alert("Could not get your current location.");
      }
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showCurrentLocationButton && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-blue-50 border border-blue-200 rounded px-2 py-1 hover:bg-blue-100"
            onClick={handleUseCurrentLocation}
          >
            Use Current Location
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 border-none bg-transparent"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {suggestion}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
