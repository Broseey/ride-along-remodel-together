import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Handshake,
  Building,
  Users,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import handshakeGif from "/src/assets/images/partner-handshake.gif";

const Partner = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Backend submission to Supabase
    const { error } = await supabase.from("ride_companies").insert([
      {
        company_name: formData.companyName,
        contact_email: formData.email,
        contact_phone: formData.phone,
        description: formData.message,
        status: "pending",
      },
    ]);

    if (error) {
      toast.error("Failed to submit partnership request. Please try again.");
      return;
    }

    // Send email notification to partner@uniride.ng
    try {
      await fetch("/api/send-partner-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "partner@uniride.ng",
          subject: `New Partnership Inquiry from ${formData.companyName}`,
          text: `Company Name: ${formData.companyName}\nContact Person: ${formData.contactPerson}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPartnership Type: ${formData.partnershipType}\n\nMessage:\n${formData.message}`,
        }),
      });
    } catch (e) {
      // Optionally log or toast error, but don't block user
    }

    toast.success(
      "Partnership request submitted! Our team will contact you soon."
    );
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      partnershipType: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section - About-style */}
      <section
        className="relative bg-black text-white py-20"
        style={{
          backgroundImage: `url(${handshakeGif})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Partner with Uniride
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join us in revolutionizing student transportation across Nigeria.
            Together, we can create better mobility solutions for universities
            and students.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Partnership Benefits */}
          <div className="space-y-8">
            <Card className="rounded-3xl shadow-md bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-6 w-6 text-blue-600" />
                  Partnership Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">University Partnerships</h4>
                    <p className="text-sm text-gray-600">
                      Collaborate with us to provide official transportation
                      services for your institution.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Corporate Solutions</h4>
                    <p className="text-sm text-gray-600">
                      Provide employee transportation solutions with our
                      corporate packages.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Technology Integration</h4>
                    <p className="text-sm text-gray-600">
                      Integrate our API and services into your existing
                      platforms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl shadow-md bg-white/80">
              <CardHeader>
                <CardTitle>Why Partner with Us?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>
                      Growing student network across key Nigerian universities
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Active presence in top campuses and student communities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>99% safety rating and verified driver network</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span>Vision-driven team building Nigeria’s #1 student mobility platform</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-3xl shadow-md bg-white/80">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Partnership Email</p>
                    <p className="text-sm text-gray-600">partner@uniride.ng</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Partnership Hotline</p>
                    <p className="text-sm text-gray-600">
                      +234 (0) 800 PARTNER
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Partnership Form */}
          <Card className="rounded-3xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Start a Partnership
              </CardTitle>
              <p className="text-gray-600">
                Tell us about your organization and how we can work together
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="companyName">
                    Company/Organization Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    placeholder="Enter your organization name"
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      handleInputChange("contactPerson", e.target.value)
                    }
                    placeholder="Enter contact person name"
                    required
                    className="rounded-full"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="your@email.com"
                      required
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+234 xxx xxx xxxx"
                      required
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="partnershipType">Partnership Type *</Label>
                  <Select
                    value={formData.partnershipType}
                    onValueChange={(value) =>
                      handleInputChange("partnershipType", value)
                    }
                  >
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select partnership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">
                        University Partnership
                      </SelectItem>
                      <SelectItem value="corporate">
                        Corporate Solutions
                      </SelectItem>
                      <SelectItem value="technology">
                        Technology Integration
                      </SelectItem>
                      <SelectItem value="investor">
                        Investment Opportunity
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    placeholder="Tell us about your partnership goals and how we can work together..."
                    rows={5}
                    required
                    className="rounded-2xl"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg md:text-xl rounded-full shadow min-w-[180px] font-semibold transition-all duration-200 disabled:opacity-60"
                  disabled={
                    !formData.companyName ||
                    !formData.contactPerson ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.partnershipType ||
                    !formData.message
                  }
                >
                  Send Partnership Inquiry
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  We'll respond to your inquiry within 24-48 hours
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="h-12 md:h-20" />
      <Footer />
    </div>
  );
};

export default Partner;
