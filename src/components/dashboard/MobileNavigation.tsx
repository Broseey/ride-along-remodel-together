
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, User, Car, MapPin } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNavigation = ({ activeTab, setActiveTab }: MobileNavigationProps) => {
  const location = useLocation();
  
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/dashboard"
    },
    {
      id: "rides",
      label: "My Rides",
      icon: Calendar,
      path: "/my-rides"
    },
    {
      id: "book",
      label: "Book",
      icon: Car,
      path: "/"
    },
    {
      id: "available",
      label: "Available",
      icon: MapPin,
      path: "/schedule"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile"
    }
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-black bg-gray-100' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
