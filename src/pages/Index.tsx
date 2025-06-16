
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AvailableRides from "@/components/AvailableRides";
import RideRequestForm from "@/components/RideRequestForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSection />
        
        {user ? (
          <div className="mt-12">
            <Tabs defaultValue="available" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="available">Available Rides</TabsTrigger>
                <TabsTrigger value="request">Request Ride</TabsTrigger>
              </TabsList>

              <TabsContent value="available">
                <AvailableRides />
              </TabsContent>

              <TabsContent value="request">
                <RideRequestForm />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
            <p className="text-gray-600 mb-6">
              Sign in or create an account to book rides and request new routes.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/signin')}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="border border-black text-black px-6 py-3 rounded-lg hover:bg-gray-50"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
