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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  Upload,
  User,
  Car,
  FileText,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DriverNavbar from "@/components/navbar/DriverNavbar";
import { Helmet, HelmetProvider } from "react-helmet-async";

const DriverSignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehiclePlateNumber: "",
    vehicleColor: "",
    vehicleType: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    hasInsurance: false,
    hasValidLicense: false,
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.fullName &&
          formData.email &&
          formData.password &&
          formData.phoneNumber
        );
      case 2:
        return (
          formData.licenseNumber &&
          formData.licenseExpiry &&
          formData.hasValidLicense
        );
      case 3:
        return (
          formData.vehicleMake &&
          formData.vehicleModel &&
          formData.vehiclePlateNumber
        );
      case 4:
        return (
          formData.emergencyContactName &&
          formData.emergencyContactPhone &&
          formData.agreeToTerms
        );
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            is_driver: true,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create driver profile
        const { error: profileError } = await supabase
          .from("driver_profiles")
          .insert({
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            date_of_birth: formData.dateOfBirth,
            address: formData.address,
            license_number: formData.licenseNumber,
            license_expiry: formData.licenseExpiry,
            vehicle_make: formData.vehicleMake,
            vehicle_model: formData.vehicleModel,
            vehicle_year: formData.vehicleYear
              ? parseInt(formData.vehicleYear)
              : null,
            vehicle_plate_number: formData.vehiclePlateNumber,
            vehicle_color: formData.vehicleColor,
            vehicle_type: formData.vehicleType,
            emergency_contact_name: formData.emergencyContactName,
            emergency_contact_phone: formData.emergencyContactPhone,
            bank_name: formData.bankName,
            account_number: formData.accountNumber,
            account_name: formData.accountName,
            verification_status: "pending",
          });

        if (profileError) throw profileError;

        toast.success("Registration successful! Please wait for verification.");

        // Show success message and redirect
        setCurrentStep(5);
      }
    } catch (error: unknown) {
      console.error("Error during signup:", error);
      let message = "An error occurred during registration";
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a password"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter your phone number"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="rounded-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your address"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold">License Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  placeholder="Enter license number"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="licenseExpiry">License Expiry Date *</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) =>
                    handleInputChange("licenseExpiry", e.target.value)
                  }
                  required
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasValidLicense"
                  checked={formData.hasValidLicense}
                  onCheckedChange={(checked) =>
                    handleInputChange("hasValidLicense", checked)
                  }
                />
                <Label htmlFor="hasValidLicense" className="text-sm">
                  I confirm that I have a valid driver's license *
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onCheckedChange={(checked) =>
                    handleInputChange("hasInsurance", checked)
                  }
                />
                <Label htmlFor="hasInsurance" className="text-sm">
                  I have valid vehicle insurance
                </Label>
              </div>
            </div>

            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                You'll need to upload your license documents after registration
                for verification.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                <Input
                  id="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={(e) =>
                    handleInputChange("vehicleMake", e.target.value)
                  }
                  placeholder="e.g. Toyota"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) =>
                    handleInputChange("vehicleModel", e.target.value)
                  }
                  placeholder="e.g. Corolla"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="vehicleYear">Year</Label>
                <Input
                  id="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={(e) =>
                    handleInputChange("vehicleYear", e.target.value)
                  }
                  placeholder="2020"
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="vehiclePlateNumber">Plate Number *</Label>
                <Input
                  id="vehiclePlateNumber"
                  value={formData.vehiclePlateNumber}
                  onChange={(e) =>
                    handleInputChange("vehiclePlateNumber", e.target.value)
                  }
                  placeholder="ABC-123-XYZ"
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="vehicleColor">Color</Label>
                <Input
                  id="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={(e) =>
                    handleInputChange("vehicleColor", e.target.value)
                  }
                  placeholder="Silver"
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) =>
                    handleInputChange("vehicleType", e.target.value)
                  }
                  placeholder="Sedan, SUV, Bus, etc."
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5" />
              <h3 className="text-lg font-semibold">
                Emergency Contact & Banking
              </h3>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                    placeholder="Emergency contact name"
                    required
                    className="rounded-full"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyContactPhone", e.target.value)
                    }
                    placeholder="Emergency contact phone"
                    required
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Banking Information (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    placeholder="Bank name"
                    className="rounded-full"
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="Account number"
                    className="rounded-full"
                  />
                </div>

                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) =>
                      handleInputChange("accountName", e.target.value)
                    }
                    placeholder="Account holder name"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked)
                }
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 underline">
                  Terms and Conditions
                </Link>{" "}
                *
              </Label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Registration Submitted!</h3>
            <p className="text-gray-600">
              Thank you for registering as a driver with Uniride. Your
              application has been submitted and is now under review.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Our team will review your application within 3-5 business
                  days
                </li>
                <li>
                  • You'll receive an email notification about your verification
                  status
                </li>
                <li>• Once approved, you can start accepting ride requests</li>
                <li>
                  • We may contact you for additional documentation if needed
                </li>
              </ul>
            </div>
            <Button
              onClick={() => navigate("/driver-signin")}
              className="w-full"
            >
              Go to Driver Login
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Driver Sign Up | Uniride</title>
        <meta
          name="description"
          content="Sign up as a driver on Uniride and start earning by offering safe, affordable rides to students and staff across Nigeria."
        />
        <meta property="og:title" content="Driver Sign Up | Uniride" />
        <meta
          property="og:description"
          content="Sign up as a driver on Uniride and start earning by offering safe, affordable rides to students and staff across Nigeria."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://uniride.ng/driver-signup" />
        <meta property="og:image" content="/og-cover.png" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <DriverNavbar />

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Join Uniride as a Driver
              </CardTitle>
              <CardDescription className="text-center">
                Complete the registration process to start driving with us
              </CardDescription>

              {currentStep < 5 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentStep >= step
                              ? "bg-black text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {step}
                        </div>
                        {step < 4 && (
                          <div
                            className={`w-8 h-1 ${
                              currentStep > step ? "bg-black" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderStep()}

                {currentStep < 5 && (
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateCurrentStep()}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!validateCurrentStep() || isLoading}
                      >
                        {isLoading ? "Submitting..." : "Submit Application"}
                      </Button>
                    )}
                  </div>
                )}
              </form>

              {currentStep < 5 && (
                <div className="mt-8 text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/driver-signin"
                      className="font-medium text-black hover:underline"
                    >
                      Sign in
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default DriverSignUp;
