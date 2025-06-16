import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, DownloadCloud, Globe, Map, Shield, Users } from "lucide-react";
const HowItWorks = () => {
  return <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How Campus Ride Works</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Getting a ride or joining other students for your campus journey is easy with CampusRide
          </p>
        </div>
      </section>
      
      {/* Three-step process */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <Map className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">1. Choose your route</h2>
              <p className="text-gray-600">
                Select your university and destination from our list of available routes that connect campuses to major cities.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <Car className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">2. Pick a ride option</h2>
              <p className="text-gray-600">
                Choose between joining an existing ride with other students or booking a private vehicle just for yourself.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <DownloadCloud className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">3. Book and go</h2>
              <p className="text-gray-600">
                Make your payment, receive your confirmation, and get ready for a comfortable journey to or from campus.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* For students section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Made for students</h2>
              <p className="text-lg mb-8">
                Our platform is designed specifically for university students who need reliable transportation between campus and their hometowns or other destinations.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800">Affordable options that fit student budgets</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800">Connect with other students traveling the same route</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800">Multiple vehicle options depending on your needs</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link to="/">
                  <Button className="bg-black hover:bg-gray-800 text-white px-6">
                    Book a ride now
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 bg-gray-200 h-80 rounded-lg flex items-center justify-center">
              <Users className="w-24 h-24 text-gray-400" />
              <span className="sr-only">Students using Campus Ride</span>
              {/* This would be an actual image in a real implementation */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Safety section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Your safety is our priority</h2>
              <p className="text-lg mb-8">
                We've built features to help you stay safe while getting around with CampusRide, especially when you're joining rides with others.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Shield className="min-w-6 h-6 mr-3 text-black" />
                  <span className="text-gray-800">All drivers are verified and background-checked</span>
                </li>
                <li className="flex items-start">
                  <Shield className="min-w-6 h-6 mr-3 text-black" />
                  <span className="text-gray-800">Share your trip details with trusted contacts</span>
                </li>
                <li className="flex items-start">
                  <Shield className="min-w-6 h-6 mr-3 text-black" />
                  <span className="text-gray-800">24/7 support for any issues during your journey</span>
                </li>
              </ul>
            </div>
            
            <div className="w-full md:w-1/2 bg-gray-200 h-80 rounded-lg flex items-center justify-center">
              <Shield className="w-24 h-24 text-gray-400" />
              <span className="sr-only">CampusRide safety features</span>
              {/* This would be an actual image in a real implementation */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Coverage section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Where we operate</h2>
          <p className="text-lg mb-12 max-w-3xl mx-auto">
            CampusRide connects major universities across Nigeria to key cities and towns, making student travel convenient and affordable.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Globe className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Southwest Region</h3>
              <p className="text-gray-600 text-sm">
                Lagos, Ogun, Oyo, Osun, Ondo, Ekiti
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Globe className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Southeast Region</h3>
              <p className="text-gray-600 text-sm">
                Enugu, Anambra, Imo, Abia, Ebonyi
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Globe className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">North Central</h3>
              <p className="text-gray-600 text-sm">
                FCT, Kogi, Kwara, Niger, Nassarawa
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Globe className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">South-South</h3>
              <p className="text-gray-600 text-sm">
                Rivers, Delta, Edo, Akwa Ibom, Cross River
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to simplify your campus travel?</h2>
          <p className="text-xl mb-8">
            Join thousands of students already using CampusRide for safe, affordable transportation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-white hover:bg-gray-100 text-black px-8 py-6 h-auto text-lg">
                Book a ride
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" className="border-white px-8 py-6 h-auto text-lg bg-white text-zinc-900">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2023 CampusRide. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default HowItWorks;