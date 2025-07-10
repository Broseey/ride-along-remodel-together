import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import {
  MapPin,
  Clock,
  Users,
  Shield,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RideBookingFormNew from "@/components/RideBookingFormNew";
import AvailableRides from "@/components/AvailableRides";
import Footer from "@/components/Footer";
import { useAuth } from "@shared/contexts/AuthContext";
import { toast } from "sonner";
import drivergifImg from "@/assets/images/inacardriving.gif";
import peopleImg from "@/assets/images/peopeimage.avif";
import acrossRoadImgWebp from "@/assets/images/optimized/acrossroadImg.webp";
import acrossRoadImgJpg from "@/assets/images/optimized/acrossroadImg.jpg";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookRideClick = () => {
    if (!user) {
      toast.error("Please sign in to book a ride");
      navigate("/signin");
      return;
    }
    // If user is authenticated, they can use the booking form directly
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Helmet>
          <title>
            Uniride – Nigeria Student Ride App for Campus to State Travel |
            Safe, Affordable University Rides
          </title>
          <meta
            name="description"
            content="Uniride is Nigeria’s premier student ride-sharing platform. Book safe, affordable rides between your campus and home—serving major universities nationwide. Join the ride movement!"
          />
          <meta
            name="keywords"
            content="Uniride, Uniride.ng, Uniride Nigeria, student ride sharing Nigeria, student ride app Nigeria, campus ride Nigeria, university rides in Nigeria, rides for Nigerian students, campus to state travel, student transport Nigeria, university transport Nigeria, safe student travel, affordable student rides, campus carpool Nigeria, Covenant University rides, ABUAD transport, BELLS university transport, Bowen carpool, Babcock rides, Pan-Atlantic university transport, Baze University transport, Nile University rides, book ride university Nigeria"
          />
          <meta
            property="og:title"
            content="Uniride – Student Ride App for Campus to State Travel in Nigeria | Affordable, Safe, and Reliable Rides Across Nigerian Universities"
          />
          <meta
            property="og:description"
            content="Uniride is Nigeria’s premier student ride-sharing platform. Book safe, affordable rides between your campus and home—serving major universities nationwide. Join the ride movement!"
          />
          <meta
            name="twitter:title"
            content="Uniride – Student Ride App for Campus to State Travel in Nigeria | Affordable, Safe, and Reliable Rides Across Nigerian Universities"
          />
          <meta
            name="twitter:description"
            content="Uniride is Nigeria’s premier student ride-sharing platform. Book safe, affordable rides between your campus and home—serving major universities nationwide. Join the ride movement!"
          />
        </Helmet>

        <Navbar />

        {/* Hero Section */}
        <div className="container mx-auto px-4 lg:pl-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 w-full">
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="flex items-center gap-2 mb-0 sm:mb-4">
                  <div className="bg-black rounded-full p-2">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Nigeria's #1 Student Ride Platform
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                  Campus Rides
                  <span className="block text-black">Made Easy</span>
                </h1>

                <p className="text-base sm:text-lg md:text-lg text-gray-600 leading-relaxed max-w-lg md:max-w-xl mt-2">
                  Safe, reliable rides connecting campuses and cities
                </p>

                {/* Booking Form: Show immediately under tagline on mobile */}
                {/* Removed mobile-only form for consistency across all screen sizes */}

                {/* Hero Image & Info Card - Only on desktop */}
                <div className="relative flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 overflow-hidden shadow-lg hidden lg:flex">
                  {/* Left: Uber-style Info Card */}

                  {/* Right: Real Hero Image */}
                  <div className="relative w-full md:w-2/3 h-48 md:h-56 flex items-center justify-center"></div>
                  <div className="absolute inset-0 w-full h-full">
                    <picture>
                      <source srcSet={acrossRoadImgWebp} type="image/webp" />
                      <img
                        src={acrossRoadImgJpg}
                        alt="Students sharing a ride"
                        className="object-cover w-full h-full rounded-2xl shadow-md border border-gray-100"
                        style={{ objectPosition: "50% top" }}
                      />
                    </picture>
                    <div className="absolute inset-0 bg-[#111111] bg-opacity-40 rounded-2xl"></div>
                  </div>
                </div>

                {/* Remove quick action buttons on mobile for a cleaner look */}
                <div className="flex-col sm:flex-row gap-4 hidden md:flex">
                  <Button
                    size="lg"
                    className="bg-black text-white px-6 py-3 text-base md:text-lg font-medium transition-all duration-200 hover:bg-gray-800"
                    onClick={handleBookRideClick}
                  >
                    <Target className="mr-2 h-5 w-5" />
                    Start Riding
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-black text-black px-6 py-3 text-base md:text-lg font-medium transition-all duration-200 hover:bg-gray-100 hover:text-black"
                    onClick={() => navigate("/drive")}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Drive with Us
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form for desktop */}
            <div className="w-full max-w-lg mx-auto lg:sticky lg:top-8 min-w-[350px]">
              <RideBookingFormNew />
              {/* Show 'How it works?' link only on mobile */}
              <div className="mt-4 flex justify-end lg:hidden">
                <Link
                  to="/how-it-works"
                  className=" text-black underline decoration-1 underline-offset-4 decoration-double text-base font-medium hover:text-gray-800 transition-colors duration-150"
                >
                  How it works?
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights / Suggestions Section (Uber-style) */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gray-50 rounded-3xl p-8 shadow-md max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Safe & Trusted</h3>
                  <p className="text-gray-600 text-sm">
                    All rides are verified and drivers are screened for your
                    safety and peace of mind.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Campus to City</h3>
                  <p className="text-gray-600 text-sm">
                    Connect with students for rides between universities and
                    major cities across Nigeria.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
                  <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Affordable & Reliable
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Enjoy affordable fares and reliable service, every time you
                    book a ride with Uniride.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Image Section: Desktop/Tablet Only */}
        <section className="w-full bg-gradient-to-r from-blue-100 to-purple-100 justify-center items-center hidden lg:flex relative">
          <img
            src={peopleImg}
            alt="Students connecting for rides"
            className="w-full h-64 shadow-lg object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#111111] bg-opacity-30 rounded-none"></div>
          {/* Optional: Overlay text or content */}
          {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-white text-2xl font-bold">Connect. Ride. Save.</h3>
        </div> */}
        </section>

        {/* Mobile-Only Image Section: Uber-style full-width, larger rectangle */}
        <section className="w-full py-2 px-2 bg-white block lg:hidden">
          <img
            src={drivergifImg}
            alt="Students ready to ride"
            className="w-full h-[320px] object-cover rounded-2xl shadow"
          />
        </section>

        {/* Available Rides Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Available Rides
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join other students on their journey. Book your seat on rides
                that match your route.
              </p>
            </div>

            <div className="flex justify-center">
              <AvailableRides />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white text-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to ride or drive with Uniride?
            </h2>
            <p className="text-xl text-gray-800 mb-10">
              Join thousands already using Uniride for safe, affordable
              transportation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg md:text-xl rounded-full shadow w-full sm:w-auto min-w-[180px] flex-1"
                >
                  Sign up
                </Button>
              </Link>
              <Link to="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-black hover:bg-gray-100 hover:text-black px-8 py-4 text-lg md:text-xl rounded-full shadow w-full sm:w-auto min-w-[180px] flex-1"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Index;
