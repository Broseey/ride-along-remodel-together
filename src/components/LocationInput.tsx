
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}

const LocationInput = ({ label, placeholder, value, onChange, icon }: LocationInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
        <Input
          id={label}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-12"
        />
      </div>
    </div>
  );
};

export default LocationInput;
