
import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { CreditCard, User, MapPin, ChevronRight, Settings, HelpCircle } from "lucide-react";

const AccountLinks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account & Support</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          <Link to="/my-rides">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                <p className="text-sm font-medium">My Rides</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <Link to="/schedule">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
                <p className="text-sm font-medium">Schedule Ride</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3 text-gray-500" />
              <p className="text-sm font-medium">Profile Settings</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <Link to="/help">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
                <p className="text-sm font-medium">Help & Support</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountLinks;
