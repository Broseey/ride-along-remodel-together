import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Car } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DriverNavbar from "@/components/navbar/DriverNavbar";
import { Helmet, HelmetProvider } from "react-helmet-async";

const DriverSignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has a driver profile
        const { data: driverProfile, error: profileError } = await supabase
          .from("driver_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          toast.error(
            "Driver profile not found. Please sign up as a driver first."
          );
          await supabase.auth.signOut();
          navigate("/driver-signup");
          return;
        }

        toast.success("Signed in successfully!");
        navigate("/driver-dashboard");
      }
    } catch (error: unknown) {
      console.error("Error during sign in:", error);
      let message = "An error occurred during sign in";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <DriverNavbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Driver Sign In</CardTitle>
              <CardDescription>
                Sign in to your driver account to start accepting rides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="name@example.com"
                      required
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder="••••••••"
                        required
                        className="rounded-full"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-900"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/driver-signup"
                    className="font-medium text-black hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <div className="flex justify-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Looking to book a ride instead?{" "}
                    <Link to="/signin" className="text-black hover:underline">
                      Passenger sign in
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default DriverSignIn;
