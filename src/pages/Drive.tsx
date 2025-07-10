import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import {
  Car,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Shield,
  Star,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import DriverNavbar from "@/components/navbar/DriverNavbar";
import Footer from "@/components/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
// Import images at the top
import driveHeroImgWebp from "@/assets/images/drive.webp";
import requirementsImgWebp from "@/assets/images/optimized/environment.webp";
import requirementsImgJpg from "@/assets/images/optimized/environment.jpg";
import step1ImgWebp from "@/assets/images/optimized/checkingcomputer.webp";
import step1ImgJpg from "@/assets/images/optimized/checkingcomputer.jpg";
import step2ImgWebp from "@/assets/images/optimized/happyjump.webp";
import step2ImgJpg from "@/assets/images/optimized/happyjump.jpg";
import step3ImgWebp from "@/assets/images/optimized/moneycovers.webp";
import step3ImgJpg from "@/assets/images/optimized/moneycovers.jpg";
const Drive = () => (
  <HelmetProvider>
    <>
      <Helmet>
        <title>Drive with Uniride | Become a Campus Driver</title>
        <meta
          name="description"
          content="Drive with Uniride and earn by offering safe, affordable rides to students and staff. Join our trusted community of campus drivers."
        />
        <meta property="og:title" content="Drive with Uniride" />
        <meta
          property="og:description"
          content="Drive with Uniride and earn by offering safe, affordable rides to students and staff."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://uniride.ng/drive" />
        <meta property="og:image" content="/og-cover.png" />
      </Helmet>
      <DriverNavbar />

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Drive when you want, make what you need
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Make money on your schedule with deliveries or rides—or both.
                You can use your own car or choose a rental through Uniride.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/driver-signup">
                  <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold w-full sm:w-auto">
                    Get started as Driver
                  </Button>
                </Link>
                <Link to="/driver-signin">
                  <Button
                    variant="outline"
                    className="border-white hover:bg-white px-8 py-3 text-lg font-semibold w-full sm:w-auto text-zinc-950"
                  >
                    Driver Sign in
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                <img
                  src={driveHeroImgWebp}
                  alt="Drive Hero"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earning Potential Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why drive with Uniride?</h2>
            <p className="text-xl text-gray-600">
              Set your own schedule and earn money when you want
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Earn on your schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Make money when you want. Drive during busy times to earn
                  more, or take a break whenever you need.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Work when you want</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You're the boss. You decide when to go online and when to log
                  off. Drive as much or as little as you want.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Get support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every trip is covered by commercial insurance, and we provide
                  24/7 support when you need it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                What you need to drive
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">Be at least 21 years old</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">Have a valid driver's license</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">
                    Have an eligible 4-door vehicle
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">Have a smartphone</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">Pass a background check</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <picture>
                  <source srcSet={requirementsImgWebp} type="image/webp" />
                  <img
                    src={requirementsImgJpg}
                    alt="Requirements"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/50 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-gray-600">
              Get started in just a few steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                <picture>
                  <source srcSet={step1ImgWebp} type="image/webp" />
                  <img
                    src={step1ImgJpg}
                    alt="Step 1"
                    className="absolute inset-0 w-full h-full object-cover object-top rounded-lg"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/50 rounded-lg" />
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <Users className="h-16 w-16 text-white" />
                  <span className="ml-2 text-white font-semibold">Step 1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Sign up online</h3>
              <p className="text-gray-600">
                Tell us about yourself and your car. We'll guide you through the
                onboarding process step by step.
              </p>
            </div>

            <div className="text-center">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                <picture>
                  <source srcSet={step2ImgWebp} type="image/webp" />
                  <img
                    src={step2ImgJpg}
                    alt="Step 2"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/50 rounded-lg" />
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <Shield className="h-16 w-16 text-white" />
                  <span className="ml-2 text-white font-semibold">Step 2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Get approved</h3>
              <p className="text-gray-600">
                Complete a quick background check and vehicle inspection. Most
                drivers get approved within 1-3 days.
              </p>
            </div>

            <div className="text-center">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                <picture>
                  <source srcSet={step3ImgWebp} type="image/webp" />
                  <img
                    src={step3ImgJpg}
                    alt="Step 3"
                    className="absolute inset-0 w-full h-full object-cover  rounded-lg"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/50 rounded-lg" />
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <Car className="h-16 w-16 text-white" />
                  <span className="ml-2 text-white font-semibold">Step 3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Start earning</h3>
              <p className="text-gray-600">
                Go online in the Driver app and start receiving ride requests.
                You'll be earning in no time!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gray-100 text-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start driving?
          </h2>
          <p className="text-xl text-gray-800 mb-10">
            Join thousands of drivers who are already earning with Uniride
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/driver-signup" className="">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg md:text-xl w-full sm:w-auto"
              >
                Sign up to drive
              </Button>
            </Link>
            <Link to="/driver-signin" className="">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-black hover:bg-gray-100 hover:text-black  px-8 py-4 text-lg md:text-xl w-full sm:w-auto"
              >
                Driver Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer placeholder */}
      <Footer />
    </>
  </HelmetProvider>
);
export default Drive;
