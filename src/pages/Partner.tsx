
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Users, TrendingUp, Shield, CheckCircle, Mail, Phone, Globe, Car, Route, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const partnerFormSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website_url: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().min(50, "Description must be at least 50 characters"),
  vehicle_count: z.string().min(1, "Please specify number of vehicles"),
  service_areas: z.string().min(10, "Please specify your service areas"),
});

type PartnerFormValues = z.infer<typeof partnerFormSchema>;

const Partner = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      company_name: "",
      contact_email: "",
      contact_phone: "",
      website_url: "",
      description: "",
      vehicle_count: "",
      service_areas: "",
    },
  });

  const onSubmit = async (values: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ride_companies')
        .insert({
          company_name: values.company_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          website_url: values.website_url || null,
          description: values.description,
          vehicle_count: parseInt(values.vehicle_count),
          service_areas: values.service_areas,
          status: 'pending',
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Partnership application submitted successfully!");
      form.reset();
    } catch (error) {
      console.error('Error submitting partnership application:', error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Partner with Uniride
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join our network of trusted transportation companies and help us provide safe, 
            reliable rides for students across Nigeria. Together, we can revolutionize campus transportation.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner with Us?</h2>
            <p className="text-xl text-gray-600">Unlock new opportunities for your transportation business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Access to Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with thousands of students who need reliable transportation 
                  between universities and cities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Increase Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Optimize your vehicle utilization and increase revenue with 
                  our demand-driven booking platform.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Verified Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join a verified network of transportation providers with 
                  background checks and quality standards.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle>Brand Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Increase your brand visibility among university students 
                  and build lasting customer relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Benefits Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">What You Get as Our Partner</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fleet Management Support</h3>
                    <p className="text-gray-600">Advanced tools to manage your fleet, track performance, and optimize routes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Route className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Route Optimization</h3>
                    <p className="text-gray-600">Smart route planning to maximize efficiency and minimize empty trips.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance Analytics</h3>
                    <p className="text-gray-600">Detailed insights into your business performance and growth opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Partnership Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Valid business registration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Minimum 3 vehicles in fleet</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Valid insurance coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Verified driver background checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Commitment to safety standards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Service area coverage plan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Partnership Process</h2>
            <p className="text-xl text-gray-600">Simple steps to become a Uniride partner</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Apply</h3>
              <p className="text-gray-600">
                Submit your partnership application with company details and 
                required documentation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Review</h3>
              <p className="text-gray-600">
                Our team reviews your application and conducts necessary 
                background checks and verifications.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Onboarding</h3>
              <p className="text-gray-600">
                Complete the onboarding process including training, 
                system setup, and integration testing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-bold mb-4">Launch</h3>
              <p className="text-gray-600">
                Go live on our platform and start receiving bookings 
                from students immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Apply for Partnership</h2>
            <p className="text-xl text-gray-600">Fill out the form below to start your partnership with Uniride</p>
          </div>

          {isSubmitted ? (
            <Card className="text-center py-12 border-0 shadow-xl">
              <CardContent>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Thank you for your interest in partnering with Uniride. We'll review your 
                  application and get back to you within 3-5 business days with next steps.
                </p>
                <div className="space-y-3 text-sm text-gray-500 mb-6">
                  <p>📧 You'll receive a confirmation email shortly</p>
                  <p>📞 Our team may contact you for additional information</p>
                  <p>⏱️ Average review time: 3-5 business days</p>
                </div>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Submit Another Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Company Name *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Contact Email *
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contact@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contact_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Contact Phone *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="+234 xxx xxx xxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Website URL (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="vehicle_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              Number of Vehicles *
                            </FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service_areas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Route className="h-4 w-4" />
                              Service Areas *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Lagos, Ibadan, Abeokuta" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your company, fleet size, service areas, experience in transportation, safety measures, and why you want to partner with Uniride..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-black text-white hover:bg-gray-800 py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting Application...
                        </div>
                      ) : (
                        "Submit Partnership Application"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">© 2025 Uniride. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Partner;
