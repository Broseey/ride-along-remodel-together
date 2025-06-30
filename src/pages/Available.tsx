
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import AvailableRides from "@/components/AvailableRides";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

const Available = () => {
  const [activeTab, setActiveTab] = useState("available");
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Rides</h1>
          <p className="text-gray-600 mt-2">Find and join rides that match your route</p>
        </div>

        <div className="flex justify-center">
          <AvailableRides />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MobileNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
    </div>
  );
};

export default Available;
