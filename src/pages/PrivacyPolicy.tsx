
import React from "react";
import Navbar from "@/components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: June 2, 2025</p>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At Uniride, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when 
              you use our ride-sharing platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>University affiliation and student status</li>
                  <li>Profile photo and preferences</li>
                  <li>Payment information and transaction history</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Location Data:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Pickup and drop-off locations</li>
                  <li>GPS coordinates during rides (for safety)</li>
                  <li>Frequently used locations for convenience</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Usage Information:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>App usage patterns and preferences</li>
                  <li>Device information and IP address</li>
                  <li>Ride history and ratings</li>
                  <li>Communication logs with drivers and support</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Facilitate ride bookings and connections with drivers</li>
              <li>Process payments and manage your account</li>
              <li>Ensure safety and security of all users</li>
              <li>Provide customer support and resolve issues</li>
              <li>Improve our services and user experience</li>
              <li>Send important notifications and updates</li>
              <li>Comply with legal requirements and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>With Drivers:</strong> Basic contact information and pickup/drop-off locations</li>
              <li><strong>With Other Riders:</strong> First name and pickup location for shared rides</li>
              <li><strong>Service Providers:</strong> Payment processors, SMS/email services, analytics tools</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect safety</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We never sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement robust security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Restricted access to personal information on a need-to-know basis</li>
              <li>Secure payment processing through certified providers</li>
              <li>Regular staff training on data protection practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access and review your personal information</li>
              <li>Update or correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Control location sharing settings</li>
              <li>Request data portability or restrictions on processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@uniride.com or through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply 
              with legal obligations. Typically, we keep:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Account information until account deletion</li>
              <li>Ride history for 3 years for safety and support purposes</li>
              <li>Payment records for 7 years as required by law</li>
              <li>Location data for 30 days unless longer retention is required for safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
              and provide personalized content. You can control cookie settings through your browser, 
              but some features may not work properly if cookies are disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 18. We do not knowingly collect personal 
              information from children. If you believe a child has provided us with personal information, 
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be processed and stored in countries other than Nigeria. We ensure appropriate 
              safeguards are in place to protect your data in accordance with applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy periodically to reflect changes in our practices or legal 
              requirements. We will notify you of significant changes via email or app notification. 
              Your continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this privacy policy or our data practices, please contact us:
              <br />
              Email: privacy@uniride.com
              <br />
              Phone: +234 800 123 4567
              <br />
              Address: 123 Innovation Hub, Yaba, Lagos, Nigeria
              <br />
              Data Protection Officer: dpo@uniride.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
