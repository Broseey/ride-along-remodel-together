
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaystackPaymentProps {
  email: string;
  amount: number;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  reference: string;
}

const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  email,
  amount,
  onSuccess,
  onClose,
  reference
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_test_your_public_key_here', // Replace with your actual public key
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
          onClose();
        }
      });
      handler.openIframe();
    } else {
      toast.error('Payment system not loaded. Please try again.');
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      Pay ₦{amount.toLocaleString()}
    </Button>
  );
};

export default PaystackPayment;
