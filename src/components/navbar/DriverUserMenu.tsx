
import React from "react";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, LogOut, Settings, Truck, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@shared/contexts/AuthContext";

interface DriverProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  license_number: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_plate: string | null;
  is_verified: boolean;
  is_online: boolean;
}

interface DriverUserMenuProps {
  currentUser: DriverProfile;
}

const DriverUserMenu = ({ currentUser }: DriverUserMenuProps) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-white hover:bg-white/10 border-none">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="font-medium">{currentUser.full_name || 'Driver'}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 border-b">
          <p className="font-medium">{currentUser.full_name || 'Driver'}</p>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
        </div>
        <DropdownMenuItem asChild>
          <Link to="/driver-dashboard" className="cursor-pointer">
            <Truck className="mr-2 h-4 w-4" />
            Driver Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/driver-earnings" className="cursor-pointer">
            <DollarSign className="mr-2 h-4 w-4" />
            Earnings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Driver Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DriverUserMenu;
