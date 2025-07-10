import {
  Car,
  Calendar,
  HelpCircle,
  Info,
  Truck,
  DollarSign,
  MapPin,
  Users,
  Star,
  Settings,
  Building2,
} from "lucide-react";
import { MenuItem } from "./NavbarTypes";

export const useMenuItems = (
  isAuthenticated: boolean,
  userType: "user" | "driver" = "user"
): MenuItem[] => {
  if (userType === "driver") {
    // Driver-specific menu items
    if (isAuthenticated) {
      return [
        { icon: Truck, label: "Dashboard", path: "/driver-dashboard" },
        { icon: DollarSign, label: "Earnings", path: "/driver-earnings" },
        { icon: MapPin, label: "Go Online", path: "/driver-online" },
        { icon: Users, label: "Passengers", path: "/driver-passengers" },
        { icon: Star, label: "Ratings", path: "/driver-ratings" },
        { icon: Settings, label: "Account", path: "/driver-account" },
      ];
    } else {
      return [
        { icon: Truck, label: "Drive & Earn", path: "/drive" },
        {
          icon: DollarSign,
          label: "Driver Requirements",
          path: "/driver-requirements",
        },
        { icon: HelpCircle, label: "Driver Help", path: "/driver-help" },
      ];
    }
  } else {
    // Regular user menu items
    if (isAuthenticated) {
      return [
        { icon: Car, label: "My Rides", path: "/my-rides" },
        { icon: Calendar, label: "Schedule", path: "/schedule" },
        { icon: Car, label: "Available Rides", path: "/available" },
        { icon: HelpCircle, label: "Help", path: "/help" },
        { icon: Info, label: "About", path: "/about" },
      ];
    } else {
      return [
        { icon: Car, label: "Book a Ride", path: "/" },
        { icon: Truck, label: "Drive", path: "/drive" },
        { icon: Building2, label: "Partner with Uniride", path: "/partner" },
        { icon: HelpCircle, label: "Help", path: "/help" },
        { icon: Info, label: "About", path: "/about" },
      ];
    }
  }
};
