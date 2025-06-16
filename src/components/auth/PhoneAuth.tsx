
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PhoneAuthProps {
  onSuccess?: () => void;
}

const PhoneAuth = ({ onSuccess }: PhoneAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsOtpSent(true);
        toast.success("OTP sent to your phone!");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Phone authentication may not be configured.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully signed in!");
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isOtpSent ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 bg-white border-gray-200"
                placeholder="+234 800 123 4567"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={sendOtp}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-neutral-800"
          >
            {isLoading ? "Sending..." : "Send OTP"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <Input
              className="bg-white border-gray-200 text-center tracking-widest"
              placeholder="123456"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <p className="text-sm text-gray-600 mt-1">
              OTP sent to {phoneNumber}
            </p>
          </div>
          <Button
            onClick={verifyOtp}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-neutral-800"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button
            onClick={() => setIsOtpSent(false)}
            variant="ghost"
            className="w-full"
          >
            Change Phone Number
          </Button>
        </>
      )}
    </div>
  );
};

export default PhoneAuth;
