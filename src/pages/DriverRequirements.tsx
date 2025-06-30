import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Car,
  Shield,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DriverNavbar from "@/components/navbar/DriverNavbar";
import Footer from "@/components/Footer";

const DriverRequirements = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Driver Requirements</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know to become a Uniride driver
          </p>
        </div>

        {/* Basic Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6" />
              Basic Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Be at least 21 years old</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Have at least 3 years of driving experience</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>
                Be a Nigerian citizen or have valid work authorization
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Pass a comprehensive background check</span>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Car className="h-6 w-6" />
              Vehicle Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>4-door vehicle in good condition</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Vehicle must be 2010 model year or newer</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Valid vehicle registration and insurance</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Pass vehicle inspection</span>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Valid Nigerian driver's license</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Vehicle registration certificate</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Valid insurance certificate</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>National ID or International passport</span>
            </div>
          </CardContent>
        </Card>

        {/* Technology Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Smartphone className="h-6 w-6" />
              Technology Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Android 8.0+ or iOS 13.0+ smartphone</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Stable internet connection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>GPS capability enabled</span>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-800">
              <AlertCircle className="h-6 w-6" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <ul className="space-y-2">
              <li>• All documents must be current and valid</li>
              <li>• Background checks typically take 3-5 business days</li>
              <li>
                • Vehicle inspections can be scheduled after document approval
              </li>
              <li>
                • Commercial insurance is provided by Uniride during active
                trips
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/driver-signup">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg">
              Apply to Become a Driver
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DriverRequirements;
