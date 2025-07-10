import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
import { Helmet, HelmetProvider } from "react-helmet-async";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Supabase will redirect with an access_token in the URL hash
  // No need to manually extract it, supabase.auth.updateUser will use the session

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! You can now sign in.");
      navigate("/signin");
    }
    setIsLoading(false);
  };

  // Check for Supabase error in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error=access_denied") && hash.includes("otp_expired")) {
      setErrorMsg(
        "Your password reset link has expired or is invalid. Please request a new reset email."
      );
    } else if (hash.includes("error=")) {
      // Generic error handler for other Supabase errors
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const desc = params.get("error_description") || "An error occurred.";
      setErrorMsg(desc.replace(/\+/g, " "));
    }
  }, []);

  // If user lands here without a valid session (no access_token in hash), show a tip
  useEffect(() => {
    if (!window.location.hash && !errorMsg) {
      setErrorMsg(
        "This page is for password resets only. Please use the link sent to your email, or request a new reset email."
      );
    }
  }, [errorMsg]);

  if (errorMsg) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <Helmet>
            <title>Reset Password | Uniride</title>
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
              <CardTitle className="text-2xl font-bold text-red-700">
                Reset Link Invalid
              </CardTitle>
              <CardDescription>{errorMsg}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link
                to="/forgot-password"
                className="text-black hover:underline"
              >
                Request a new password reset
              </Link>
            </CardContent>
          </Card>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Helmet>
          <title>Reset Password | Uniride</title>
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
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </HelmetProvider>
  );
};

export default ResetPassword;
