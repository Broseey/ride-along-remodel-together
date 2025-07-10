import { useState } from "react";
import { supabase } from "@shared/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@shared/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // IMPORTANT: For production, set this URL to your deployed domain
    // For local dev, this will use your current localhost
    const redirectTo =
      process.env.NODE_ENV === "production"
        ? "https://uniride.ng/reset-password"
        : window.location.origin + "/reset-password";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    }
    setIsLoading(false);
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Helmet>
          <title>Forgot Password | Uniride</title>
        </Helmet>
        <header className="w-full flex justify-center py-6">
          <Link to="/">
            <img
              src="/android-chrome-512x512.png"
              alt="Uniride Logo"
              className="h-10 w-10 rounded-full shadow"
            />
          </Link>
        </header>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center text-green-700 py-6">
                Check your email for a password reset link.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-900"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
            <div className="mt-6 text-center text-sm">
              <Link to="/signin" className="text-black hover:underline">
                ← Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </HelmetProvider>
  );
};

export default ForgotPassword;
