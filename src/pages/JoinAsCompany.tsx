import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@shared/integrations/supabase/client";
import { Building2, Mail, Phone, Globe, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "@/components/Footer";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().optional(),
  websiteUrl: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const JoinAsCompany = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactEmail: "",
      contactPhone: "",
      websiteUrl: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.from("ride_companies").insert({
        company_name: values.companyName,
        contact_email: values.contactEmail,
        contact_phone: values.contactPhone || null,
        website_url: values.websiteUrl || null,
        description: values.description,
      });

      if (error) {
        toast.error("Failed to submit application");
        console.error("Error:", error);
      } else {
        toast.success(
          "Application submitted successfully! We'll review your request and get back to you soon."
        );
        form.reset();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>Join as Company | Uniride</title>
          <meta
            name="description"
            content="Join Uniride as a company to offer transportation services to students and staff. Partner with us for safe, affordable, and reliable rides."
          />
          <meta property="og:title" content="Join as Company | Uniride" />
          <meta
            property="og:description"
            content="Join Uniride as a company to offer transportation services to students and staff. Partner with us for safe, affordable, and reliable rides."
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://uniride.ng/join-as-company"
          />
          <meta property="og:image" content="/og-cover.png" />
        </Helmet>

        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-black rounded-full p-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Partner with Uniride
              </h1>
              <p className="text-xl text-gray-600">
                Join our network of trusted transportation companies
              </p>
            </div>

            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Company Application</CardTitle>
                <CardDescription>
                  Fill out the form below to apply to become a partner company
                  with Uniride
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                className="pl-10 bg-white border-gray-200"
                                placeholder="Your Company Name"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900">
                              Contact Email
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  className="pl-10 bg-white border-gray-200"
                                  placeholder="contact@company.com"
                                  type="email"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900">
                              Contact Phone (Optional)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  className="pl-10 bg-white border-gray-200"
                                  placeholder="+234 800 123 4567"
                                  type="tel"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Website URL (Optional)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                className="pl-10 bg-white border-gray-200"
                                placeholder="https://www.yourcompany.com"
                                type="url"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">
                            Company Description
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                              <Textarea
                                className="pl-10 bg-white border-gray-200 min-h-32"
                                placeholder="Tell us about your company, your fleet size, service areas, and why you'd like to partner with Uniride..."
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-black text-white hover:bg-neutral-800"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Submitting Application..."
                        : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Have questions? Contact us at{" "}
                <a
                  href="mailto:partnerships@uniride.com"
                  className="text-black hover:underline"
                >
                  partnerships@uniride.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </HelmetProvider>
  );
};

export default JoinAsCompany;
