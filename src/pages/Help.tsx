import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";

const Help = () => {
  const currentYear = new Date().getFullYear();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  const faqs = [
    {
      question: "How do I book a ride?",
      answer:
        "Simply select your departure and destination locations, choose your preferred date and time, select a vehicle, and proceed to payment. Once confirmed, you'll receive booking details.",
    },
    {
      question: "How much does it cost to book a ride?",
      answer:
        "Pricing varies based on the route, vehicle type, and whether you're booking a seat or the entire ride. Full ride bookings receive a 10% discount.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking up to 24 hours before departure for a full refund. Cancellations within 24 hours may incur charges.",
    },
    {
      question: "How do I become a driver?",
      answer:
        "Visit our 'Become a Driver' page, complete the registration form with your license and vehicle details, and wait for verification. Our team will review your application within 3-5 business days.",
    },
    {
      question: "Is Uniride safe?",
      answer:
        "Yes, all our drivers are verified with background checks, valid licenses, and insurance. We maintain a 99% safety rating through strict verification processes.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods through Paystack, including bank cards, bank transfers, USSD, and QR codes.",
    },
    {
      question: "What should I do if I forgot my belongings in the bus?",
      answer:
        "If you forgot something in the bus, please contact our support team immediately with your ride details. We will coordinate with the driver to help recover your belongings as quickly as possible.",
    },
    {
      question: "What if I find someone else's belongings in the vehicle?",
      answer:
        "If you find a lost item, please inform the driver or contact our support team. We will do our best to return the item to its rightful owner.",
    },
    {
      question: "How do I report a lost or found item?",
      answer:
        "You can report lost or found items by emailing support@uniride.ng or using the contact form on this page. Provide as many details as possible to help us assist you.",
    },
    {
      question: "How do I contact support for urgent issues?",
      answer:
        "For urgent matters, please call our support line at +234 (0) 800 UNIRIDE during business hours for immediate assistance.",
    },
  ];

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess(null);
    setContactError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    try {
      const res = await fetch("/api/send-partner-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          to: "support@uniride.ng",
          type: "support-contact",
        }),
      });
      if (res.ok) {
        setContactSuccess(
          "Your message has been sent. We'll get back to you soon."
        );
        e.currentTarget.reset();
      } else {
        setContactError("Failed to send message. Please try again later.");
      }
    } catch (err) {
      setContactError("Failed to send message. Please try again later.");
    } finally {
      setContactLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section - Modern, Consistent with About/Partner */}
      <section
        className="relative bg-black text-white py-20"
        style={{
          backgroundImage:
            "url('/src/assets/images/services-customer-support-help.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/95"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* <HelpCircle className="h-14 w-14 text-blue-400 mb-4 drop-shadow-lg" /> */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Help Center
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-2 drop-shadow">
            Find answers to common questions or get in touch with our support
            team
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Contact & Form first, then FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information & Form (first on mobile/desktop) */}
          <div className="space-y-8 lg:col-span-1 order-1">
            {/* Contact Support Card - Modern, Premium Look */}
            <Card className="rounded-3xl shadow-xl bg-white/95 border-0 py-6 flex flex-col items-center justify-center">
              <CardHeader className="flex flex-col items-center border-none pb-2">
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1 text-center">
                  Contact Support
                </CardTitle>
                <p className="text-gray-500 text-base font-medium text-center max-w-xs mb-2 mt-1">
                  Our team is here to help you with any questions or issues.
                </p>
              </CardHeader>
              <CardContent className="w-full flex flex-col gap-6 items-center px-2">
                {/* Email Section */}
                <div className="flex flex-col items-center w-full mt-6 mb-2 gap-2">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      Email
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base text-black select-all">
                      support@uniride.ng
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="p-1 text-gray-500 hover:text-black"
                      onClick={() =>
                        navigator.clipboard.writeText("support@uniride.ng")
                      }
                      aria-label="Copy email"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                      </svg>
                    </Button>
                  </div>
                </div>
                {/* Phone Section */}
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      Phone
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base text-black select-all">
                      +234 (0) 800 UNIRIDE
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="p-1 text-gray-500 hover:text-black"
                      onClick={() =>
                        navigator.clipboard.writeText("+234 (0) 800 UNIRIDE")
                      }
                      aria-label="Copy phone"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                      </svg>
                    </Button>
                  </div>
                </div>
                {/* Business Hours */}
                <div className="flex flex-col items-center w-full mt-2">
                  <span className="text-sm text-gray-500 font-medium mb-1">
                    Business Hours
                  </span>
                  <span className="text-sm text-gray-700">
                    Mon - Fri: 8AM - 8PM
                  </span>
                  <span className="text-sm text-gray-700">
                    Sat - Sun: 9AM - 6PM
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form - Modernized */}
            <Card className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleContactSubmit}>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    className="rounded-full"
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    className="rounded-full"
                    required
                  />
                  <Input
                    name="subject"
                    placeholder="Subject"
                    className="rounded-full"
                    required
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    className="rounded-2xl"
                    required
                  />
                  <Button className="w-full bg-black hover:bg-gray-900 rounded-full text-lg font-semibold py-3">
                    Send Message
                  </Button>
                </form>
                {/* Feedback Messages */}
                {contactLoading && (
                  <p className="text-blue-600 text-center mt-2">Sending...</p>
                )}
                {contactSuccess && (
                  <p className="text-green-600 text-center mt-2">
                    {contactSuccess}
                  </p>
                )}
                {contactError && (
                  <p className="text-red-600 text-center mt-2">
                    {contactError}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQs (last on mobile/desktop) */}
          <div className="lg:col-span-2 order-2 mt-12 lg:mt-0 px-0 md:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-white to-gray-100 rounded-lg cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="flex items-start gap-3 text-lg">
                      <HelpCircle className="h-5 w-5 text-black mt-1 flex-shrink-0" />
                      {faq.question}
                    </CardTitle>
                    <span className="ml-2 text-black text-xl select-none">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </CardHeader>
                  {openFaq === index && (
                    <CardContent className="p-4 pt-0">
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {faq.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Help;
