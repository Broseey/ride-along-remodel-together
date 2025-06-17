
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaystackPaymentProps {
  email: string;
  amount: number;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  onCancel?: () => void;
  reference?: string;
  rideDetails?: {
    from: string;
    to: string;
    date: string;
    time: string;
    passengers: number;
  };
}

const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  email,
  amount,
  onSuccess,
  onClose,
  onCancel,
  reference = `ref_${Date.now()}`,
  rideDetails
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_test_fd701d387879bd23739ac1bc209e7ba24ea63a8f', // Replace with your actual public key
        email,
        amount: amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: reference,
        callback: function(response: any) {
          toast.success('Payment successful!');
          onSuccess(response.reference);
        },
        onClose: function() {
          toast.error('Payment cancelled');
          if (onCancel) {
            onCancel();
          } else {
            onClose();
          }
        }
      });
      handler.openIframe();
    } else {
      toast.error('Payment system not loaded. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {rideDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">From:</span> {rideDetails.from}</p>
            <p><span className="font-medium">To:</span> {rideDetails.to}</p>
            <p><span className="font-medium">Date:</span> {rideDetails.date}</p>
            <p><span className="font-medium">Time:</span> {rideDetails.time}</p>
            <p><span className="font-medium">Passengers:</span> {rideDetails.passengers}</p>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Amount: ₦{amount.toLocaleString()}</p>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={handlePayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Pay ₦{amount.toLocaleString()}
        </Button>
        
        <Button 
          onClick={onCancel || onClose}
          variant="outline"
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PaystackPayment;
