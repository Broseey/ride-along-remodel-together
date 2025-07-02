import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Navbar from "@/components/Navbar";
import BookingDetails from "@/components/BookingDetails";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

// Sample booking data (in a real app, this would come from a booking process)
const sampleBookingData = {
  from: "Lagos",
  to: "University of Ibadan",
  date: "May 15, 2023",
  time: "9:00 AM",
  passengers: 2,
  vehicle: {
    name: "Toyota Sienna",
    capacity: 6,
    price: 5000,
  },
  bookingType: "join" as "join" | "full",
  bookingId: "CMP-2023-05789",
};

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [booking] = useState(sampleBookingData);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSimulatePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
    }, 1500);
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Helmet>
          <title>Booking Confirmation | Uniride</title>
          <meta
            name="description"
            content="Your Uniride booking is confirmed! View your trip details, payment status, and next steps for your campus ride."
          />
        </Helmet>

        <Navbar />

        <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {!paymentComplete ? (
            <>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-600"
                  onClick={() => navigate("/")}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to booking
                </Button>
              </div>

              <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <BookingDetails bookingData={booking} />
                </div>

                <div>
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Method
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50">
                        <div className="h-5 w-5 rounded-full bg-purple-600"></div>
                        <span>Pay with Card</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600 block mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm text-gray-600 block mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 block mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={handleSimulatePayment}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your booking (ID: {booking.bookingId}) has been confirmed. We've
                sent the details to your email.
              </p>

              <Card className="p-6 text-left mb-6">
                <h3 className="font-medium mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From</span>
                    <span className="font-medium">{booking.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To</span>
                    <span className="font-medium">{booking.to}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium">
                      {booking.date}, {booking.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle</span>
                    <span className="font-medium">{booking.vehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers</span>
                    <span className="font-medium">{booking.passengers}</span>
                  </div>
                </div>
              </Card>

              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate("/")}
              >
                Return to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default BookingConfirmation;
