
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Shield, UserPlus } from "lucide-react";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const { adminSignIn, createAdminAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await adminSignIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        navigate("/admin");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAccount(true);

    try {
      const { error } = await createAdminAccount(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Admin account created successfully!");
        setShowCreateAdmin(false);
        // Reset form
        setEmail("");
        setPassword("");
        setFullName("");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {showCreateAdmin ? "Create Admin Account" : "Admin Sign In"}
          </CardTitle>
          <CardDescription>
            {showCreateAdmin ? "Create a new admin account" : "Access the admin dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showCreateAdmin ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isCreatingAccount}
              >
                {isCreatingAccount ? "Creating Account..." : "Create Admin Account"}
              </Button>
            </form>
          )}
          
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowCreateAdmin(!showCreateAdmin)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {showCreateAdmin ? "Back to Sign In" : "Create Admin Account"}
              </Button>
            </div>
            
            <div className="text-center text-sm">
              <Link to="/" className="text-blue-600 hover:underline">
                ← Back to home
              </Link>
            </div>
          </div>

          {/* Quick Admin Setup Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Quick Setup:</h4>
            <p className="text-xs text-blue-700">
              Use email: <strong>admin@uniride.ng</strong><br />
              Password: <strong>Unirideadmin</strong><br />
              Or create a new admin account above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignIn;
