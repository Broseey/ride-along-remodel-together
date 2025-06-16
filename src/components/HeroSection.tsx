
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <section className="bg-black text-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your campus ride,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  just a tap away
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Connect with fellow students for safe, affordable rides around campus and beyond. 
                Join the Uniride community today.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 text-lg"
                >
                  How it works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-gray-300" />
                </div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-gray-300" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-gray-400">Campus Routes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-gray-300" />
                </div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
