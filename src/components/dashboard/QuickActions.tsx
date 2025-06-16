
import React from "react";
import { Button } from "@/components/ui/button";
import { Car, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link to="/" className="w-full">
        <Button className="w-full bg-black text-white hover:bg-neutral-800 h-14 text-base rounded-[3.5rem] md:rounded-[5.5rem]">
          <Car className="mr-2 h-5 w-5" />
          Book a Ride
        </Button>
      </Link>
      <Link to="/schedule" className="w-full">
        <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white h-14 text-base rounded-[3.5rem] md:rounded-[5.5rem]">
          <Calendar className="mr-2 h-5 w-5" />
          Schedule Ride
        </Button>
      </Link>
    </div>
  );
};

export default QuickActions;
