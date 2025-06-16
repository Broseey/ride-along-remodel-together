
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PaystackPaymentProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  rideDetails: {
    from: string;
    to: string;
    date: string;
    time: string;
    passengers: number;
  };
}

const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  amount,
  email,
  onSuccess,
  onCancel,
  rideDetails
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initializePaystack = () => {
    setIsProcessing(true);
    
    // Use the existing Paystack public key
    const paystackPublicKey = "pk_test_fd701d387879bd23739ac1bc209e7ba24ea63a8f";
    
    // Check if Paystack script is loaded
    if (typeof window.PaystackPop === 'undefined') {
      toast.error("Payment system not loaded. Please refresh and try again.");
      setIsProcessing(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: email,
      amount: amount * 100, // Paystack expects amount in kobo
      currency: 'NGN',
      ref: `uniride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Ride Route",
            variable_name: "ride_route",
            value: `${rideDetails.from} to ${rideDetails.to}`
          },
          {
            display_name: "Travel Date",
            variable_name: "travel_date",
            value: `${rideDetails.date} at ${rideDetails.time}`
          },
          {
            display_name: "Passengers",
            variable_name: "passengers",
            value: rideDetails.passengers.toString()
          }
        ]
      },
      callback: function(response: any) {
        setIsProcessing(false);
        toast.success("Payment successful!");
        console.log("Payment successful:", response);
        onSuccess(response.reference);
      },
      onClose: function() {
        setIsProcessing(false);
        toast.info("Payment cancelled");
        onCancel();
      }
    });

    handler.openIframe();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CreditCard className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Complete Your Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">{rideDetails.from} → {rideDetails.to}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">{rideDetails.date} at {rideDetails.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Passengers:</span>
            <span className="font-medium">{rideDetails.passengers}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span className="text-green-600">₦{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Secured by Paystack</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <CheckCircle className="h-4 w-4" />
            <span>256-bit SSL encryption</span>
          </div>
        </div>

        {/* Payment Button */}
        <div className="space-y-3">
          <Button 
            onClick={initializePaystack}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₦{amount.toLocaleString()}
              </span>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
            disabled={isProcessing}
          >
            Cancel Payment
          </Button>
        </div>

        {/* Payment Methods */}
        <div className="text-center text-xs text-gray-500">
          <p>Accepts: Card • Bank Transfer • USSD • QR Code</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaystackPayment;
