import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/hooks/useRides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Award,
  CreditCard,
  Settings,
  Edit3,
  Save,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Profile = () => {
  const { user, userProfile } = useAuth();
  const { rides } = useRides();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: userProfile?.full_name || "",
    phone_number: userProfile?.phone_number || "",
  });

  const totalRides = rides?.length || 0;
  const completedRides =
    rides?.filter((ride) => ride.status === "completed").length || 0;
  const upcomingRides =
    rides?.filter((ride) => ride.status === "confirmed").length || 0;
  const memberSince = userProfile?.created_at
    ? new Date(userProfile.created_at).getFullYear()
    : new Date().getFullYear();

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editData.full_name,
          phone_number: editData.phone_number,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      full_name: userProfile?.full_name || "",
      phone_number: userProfile?.phone_number || "",
    });
    setIsEditing(false);
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Profile | Uniride</title>
          <meta
            name="description"
            content="View and edit your Uniride profile. Manage your account, rides, and personal information securely."
          />
          <meta property="og:title" content="Profile | Uniride" />
          <meta
            property="og:description"
            content="View and edit your Uniride profile. Manage your account, rides, and personal information securely."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://uniride.ng/profile" />
          <meta property="og:image" content="/og-cover.png" />
        </Helmet>

        <Navbar />

        <div
          className={`container mx-auto px-4 py-8 ${isMobile ? "pb-24" : ""}`}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl font-bold bg-black text-white">
                      {userProfile.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {userProfile.full_name}
                      </h1>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2"
                      >
                        {isEditing ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Edit3 className="h-4 w-4" />
                        )}
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{userProfile.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {memberSince}</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Verified Student
                      </Badge>
                      {completedRides >= 5 && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          Regular Rider
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {totalRides}
                  </div>
                  <div className="text-sm text-gray-600">Total Rides</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {completedRides}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {upcomingRides}
                  </div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={editData.full_name}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              full_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                          id="phone_number"
                          value={editData.phone_number}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              phone_number: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">
                          {userProfile.full_name || "Not provided"}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{userProfile.email}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {userProfile.phone_number || "Not provided"}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {rides && rides.length > 0 ? (
                    <div className="space-y-3">
                      {rides.slice(0, 3).map((ride) => (
                        <div
                          key={ride.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {ride.from_location} → {ride.to_location}
                            </p>
                            <p className="text-xs text-gray-600">
                              {ride.departure_date}
                            </p>
                          </div>
                          <Badge
                            variant={
                              ride.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {ride.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">
                      No rides yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>

                  <Button variant="outline" className="justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>

                  <Button variant="outline" className="justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>

                  <Button variant="outline" className="justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Loyalty Program
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MobileNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Profile;
