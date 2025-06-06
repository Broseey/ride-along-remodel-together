
import { Clock, Car } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RideTypeCardProps {
  type: string;
  description: string;
  price: string;
  time: string;
  selected: boolean;
  onClick: () => void;
}

const RideTypeCard = ({ type, description, price, time, selected, onClick }: RideTypeCardProps) => {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
        selected 
          ? "ring-2 ring-primary bg-primary/5" 
          : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{type}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-bold text-lg">{price}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {time}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RideTypeCard;
