
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Phone, Mail, MessageCircle, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DriverNavbar from "@/components/navbar/DriverNavbar";

const DriverHelp = () => {
  const faqItems = [
    {
      question: "How do I go online and start receiving ride requests?",
      answer: "Open the Uniride Driver app and tap the 'Go Online' button. Make sure your location services are enabled and you're in an area where Uniride operates."
    },
    {
      question: "When and how do I get paid?",
      answer: "Payments are processed weekly on Tuesdays for the previous week's earnings. You can view your earnings and payment history in the app's earnings section."
    },
    {
      question: "What should I do if a passenger doesn't show up?",
      answer: "Wait for 5 minutes at the pickup location, then you can cancel the trip and receive a cancellation fee. Make sure to follow the in-app cancellation process."
    },
    {
      question: "How do I handle difficult passengers?",
      answer: "Stay calm and professional. If you feel unsafe, end the trip immediately and contact support. You can also report passengers through the app after completing the trip."
    },
    {
      question: "What if my car breaks down during a trip?",
      answer: "Ensure passenger safety first, then contact Uniride support immediately. We'll help arrange alternative transportation for the passenger if needed."
    },
    {
      question: "How do I update my vehicle information?",
      answer: "Go to your driver profile in the app and select 'Vehicle Information' to update details like license plate, color, or model."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Driver Help Center</h1>
          <p className="text-xl text-gray-600">Get the support you need to drive successfully with Uniride</p>
        </div>

        {/* Contact Support */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <CardTitle>24/7 Phone Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Call us anytime for immediate assistance</p>
              <Button variant="outline" className="w-full">
                +234 800 123 4567
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle>In-App Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Chat with support directly in the driver app</p>
              <Button variant="outline" className="w-full">
                Open Driver App
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Send us an email for non-urgent matters</p>
              <Button variant="outline" className="w-full">
                driver-support@uniride.com
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contact */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-800">
              <AlertTriangle className="h-6 w-6" />
              Emergency Support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-700">
            <p className="mb-2">For safety emergencies during trips:</p>
            <p className="font-bold text-lg">Emergency Hotline: +234 911 000 000</p>
            <p className="text-sm mt-2">Available 24/7 for immediate safety concerns</p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6" />
                Driver Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Driver Manual (PDF)
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Safety Guidelines
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Tax Information
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Insurance Details
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Keep your app updated for the best experience</p>
              <p>• Maintain a 4.7+ star rating for bonus opportunities</p>
              <p>• Drive during peak hours to maximize earnings</p>
              <p>• Keep your vehicle clean and well-maintained</p>
              <p>• Be courteous and professional with passengers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverHelp;
