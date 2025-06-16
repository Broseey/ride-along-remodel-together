
import React from "react";
import Navbar from "@/components/Navbar";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">Last updated: June 2, 2025</p>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Uniride's services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not 
              use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Uniride is a technology platform that connects university students with drivers for 
              transportation services. We do not provide transportation services directly but facilitate 
              connections between users.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Ride-sharing coordination between students and verified drivers</li>
              <li>Route planning and scheduling tools</li>
              <li>Payment processing and booking management</li>
              <li>Safety features and driver verification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use Uniride, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Be at least 18 years old or have parental consent</li>
              <li>Be enrolled in a participating university</li>
              <li>Provide accurate and current information</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">For Riders:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Arrive at pickup locations on time</li>
                  <li>Respect drivers and other passengers</li>
                  <li>Pay agreed-upon fares promptly</li>
                  <li>Follow safety guidelines and vehicle rules</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">For Drivers:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Maintain valid driver's license and insurance</li>
                  <li>Ensure vehicle safety and cleanliness</li>
                  <li>Arrive punctually for scheduled rides</li>
                  <li>Treat all passengers with respect and professionalism</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Booking and Cancellation Policy</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Bookings are confirmed upon payment and driver acceptance</li>
              <li>Cancellations must be made at least 2 hours before scheduled departure</li>
              <li>Late cancellations may result in partial or no refund</li>
              <li>No-shows may result in full fare charge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All payments are processed securely through our platform. By using our services, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Pay all applicable fares and fees</li>
              <li>Provide accurate payment information</li>
              <li>Accept our refund and dispute resolution policies</li>
              <li>Authorize automatic payment processing for confirmed bookings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Safety and Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we implement safety measures, users participate at their own risk. Uniride:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Conducts basic background checks on drivers</li>
              <li>Provides emergency contact features</li>
              <li>Is not liable for accidents, injuries, or damages during rides</li>
              <li>Recommends users maintain personal insurance coverage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Prohibited Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Users may not:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the platform for illegal activities</li>
              <li>Harass, threaten, or discriminate against other users</li>
              <li>Provide false information or impersonate others</li>
              <li>Attempt to circumvent security measures</li>
              <li>Use the service for commercial purposes without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts for violations of these terms, 
              suspicious activity, or at our discretion. Users may also terminate their accounts 
              at any time through the platform settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these terms periodically. Continued use of the service after changes 
              constitutes acceptance of the new terms. We will notify users of significant changes 
              via email or platform notifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these terms, please contact us at:
              <br />
              Email: legal@uniride.com
              <br />
              Phone: +234 800 123 4567
              <br />
              Address: 123 Innovation Hub, Yaba, Lagos, Nigeria
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
