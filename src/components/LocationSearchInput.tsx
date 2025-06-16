
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  stateFilter?: string;
  className?: string;
}

// Mock location data - in a real app, this would come from an API
const locationData: { [key: string]: string[] } = {
  'Lagos': [
    'Victoria Island', 'Ikoyi', 'Lekki', 'Ikeja', 'Maryland', 'Yaba', 'Surulere', 'Ajah',
    'Banana Island', 'Lagos Island', 'Magodo', 'Gbagada', 'Ketu', 'Ojodu', 'Berger',
    'Festac Town', 'Apapa', 'Isolo', 'Oshodi', 'Alaba Market', 'Mile 2', 'Badagry'
  ],
  'Abuja': [
    'Maitama', 'Asokoro', 'Wuse', 'Garki', 'Gwarinpa', 'Kubwa', 'Karu', 'Nyanya',
    'Central Business District', 'Jabi', 'Utako', 'Gudu', 'Lokogoma', 'Lugbe Airport',
    'Gwagwalada', 'Airport Road', 'Berger', 'Dutse', 'Bwari', 'Suleja'
  ],
  'Rivers': [
    'Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Emohua', 'Etche', 'Oyigbo',
    'Trans Amadi', 'Mile 1', 'Mile 2', 'Mile 3', 'Diobu', 'GRA Phase 1', 'GRA Phase 2',
    'Ada George', 'Rumuola', 'Rumukrushi', 'Choba', 'Aluu', 'Igwuruta'
  ],
  'Kano': [
    'Fagge', 'Dala', 'Gwale', 'Kano Municipal', 'Nasarawa', 'Tarauni', 'Ungogo',
    'Sabon Gari', 'Kumbotso', 'Bichi', 'Bagwai', 'Dawakin Kudu', 'Gaya', 'Gezawa',
    'Kiru', 'Karaye', 'Kibiya', 'Rano', 'Rimin Gado', 'Shanono'
  ],
  'Oyo': [
    'Ibadan North', 'Ibadan South', 'Egbeda', 'Lagelu', 'Ido', 'Oluyole', 'Akinyele',
    'Ona Ara', 'Ibadan North East', 'Ibadan North West', 'Ibadan South East', 'Ibadan South West',
    'Bodija', 'Ring Road', 'Challenge', 'Mokola', 'Agodi', 'Dugbe', 'Eleyele', 'Sango'
  ]
};

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  value,
  onChange,
  placeholder,
  stateFilter,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.length >= 2 && stateFilter) {
      const stateSuggestions = locationData[stateFilter] || [];
      const filtered = stateSuggestions.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, stateFilter]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
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
