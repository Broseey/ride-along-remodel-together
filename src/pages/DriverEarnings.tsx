import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DriverNavbar from "@/components/navbar/DriverNavbar";
import { Helmet, HelmetProvider } from "react-helmet-async";

const DriverEarnings = () => (
  <HelmetProvider>
    <>
      <Helmet>
        <title>Driver Earnings | Uniride</title>
        <meta
          name="description"
          content="View your earnings as a Uniride driver. Track your income and payout history."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <DriverNavbar />

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Earnings Dashboard</h1>
            <p className="text-xl text-gray-600">
              Track your progress and maximize your income
            </p>
          </div>

          {/* Please sign in message for demo */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Sign In to View Your Earnings
                </h3>
                <p className="text-blue-700 mb-4">
                  Log in to your driver account to see your detailed earnings,
                  trip history, and payment information.
                </p>
                <div className="flex justify-center gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Earnings Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold">₦45,280</span>
                </div>
                <p className="text-sm text-gray-500">32 trips completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-2xl font-bold">₦182,450</span>
                </div>
                <p className="text-sm text-gray-500">124 trips completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">4.9</span>
                </div>
                <p className="text-sm text-gray-500">Based on 245 ratings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Hours Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-2xl font-bold">38h</span>
                </div>
                <p className="text-sm text-gray-500">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Earning Opportunities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Maximize Your Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Peak Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Morning Rush (7:00 - 9:00 AM)</span>
                      <span className="text-green-600 font-medium">
                        +20% surge
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evening Rush (5:00 - 7:30 PM)</span>
                      <span className="text-green-600 font-medium">
                        +25% surge
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend Nights (9:00 PM - 2:00 AM)</span>
                      <span className="text-green-600 font-medium">
                        +30% surge
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">High-Demand Areas</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>University of Lagos (UNILAG)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Lagos State University (LASU)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Victoria Island Business District</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Ikeja Computer Village</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">How You Get Paid</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Weekly payments every Tuesday</li>
                    <li>• Direct bank transfer to your account</li>
                    <li>• Instant cash-out available (small fee applies)</li>
                    <li>• View detailed earnings breakdown in app</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Earning Breakdown</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Base fare + time + distance</li>
                    <li>• Peak hour surge pricing</li>
                    <li>• Tips from passengers</li>
                    <li>• Bonus for high ratings (4.8+)</li>
                    <li>• Referral bonuses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Setting */}
          <Card>
            <CardHeader>
              <CardTitle>Set Your Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Set a weekly earning goal to stay motivated and track your
                  progress
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline">₦50,000/week</Button>
                  <Button variant="outline">₦75,000/week</Button>
                  <Button variant="outline">₦100,000/week</Button>
                  <Button>Custom Goal</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  </HelmetProvider>
);

export default DriverEarnings;
