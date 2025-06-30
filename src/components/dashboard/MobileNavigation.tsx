import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Calendar, Search } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNavigation = ({
  activeTab,
  setActiveTab,
}: MobileNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <button
          onClick={() => handleNavigation("home", "/dashboard")}
          className={`flex flex-col items-center py-2 px-3 ${
            isActive("/dashboard") ? "text-black" : "text-gray-500"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          onClick={() => handleNavigation("available", "/available")}
          className={`flex flex-col items-center py-2 px-3 ${
            isActive("/available") ? "text-black" : "text-gray-500"
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Available</span>
        </button>

        <button
          onClick={() => handleNavigation("schedule", "/schedule")}
          className={`flex flex-col items-center py-2 px-3 ${
            isActive("/schedule") ? "text-black" : "text-gray-500"
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Book</span>
        </button>

        <button
          onClick={() => handleNavigation("profile", "/profile")}
          className={`flex flex-col items-center py-2 px-3 ${
            isActive("/profile") ? "text-black" : "text-gray-500"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
