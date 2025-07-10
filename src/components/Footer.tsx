import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800 min-h-[60vh] flex flex-col justify-end pt-16 pb-16 w-full">
      <div className="max-w-screen-2xl mx-auto px-8 py-16 flex-1 flex flex-col justify-end w-full">
        <div className="flex flex-col lg:flex-row justify-between gap-20">
          {/* Brand & Social */}
          <div className="flex-1 min-w-[260px] flex flex-col gap-8 justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Uniride
              </h3>
              <p className="text-gray-400 text-md max-w-xs mb-8">
                Nigeria's premier student ride-sharing platform connecting
                universities to cities across the country.
              </p>
            </div>
            <div className="flex flex-row gap-8 mt-2 items-start">
              {/* Social icons: Instagram, Twitter, LinkedIn, Snapchat */}
              <a
                href="https://www.instagram.com/uniride_ng/"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-400 hover:scale-110 group"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com/uniride_ng"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-neutral-700 hover:scale-110 group"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                  <title>twitter</title>
                  <path
                    d="M14.094 10.317 22.28 1H20.34l-7.11 8.088L7.557 1H1.01l8.583 12.231L1.01 23H2.95l7.503-8.543L16.446 23h6.546M3.649 2.432h2.978L20.34 21.639h-2.98"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/uniride-ng/"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-blue-700 hover:scale-110 group"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5 group-hover:text-white transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>LinkedIn</title>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
                </svg>
              </a>
              <a
                href="https://snapchat.com/t/R8dY1Z"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-yellow-400 hover:scale-110 group"
                aria-label="Snapchat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.7em"
                  height="1.7em"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <title>Snapchat</title>
                  <path
                    d="M24.0116,42.2697c3.8272-.0024,4.9669-1.6066,7.486-2.7237,2.2497-.9976,5.4694.5087,6.1373-2.1616h0c.0865-1.3801,2.513-1.1579,3.8742-2.0996,1.2418-.8591,1.3659-2.2361.0902-2.778-2.8877-1.2269-5.9232-3.9144-6.6578-6.7964-.4582-1.7978,5.2788-2.3506,4.0841-5.7402-.7049-2.0001-3.2379-1.2958-4.616-.8478.9182-7.1086-2.542-13.3923-10.4098-13.3923s-11.328,6.2837-10.4098,13.3923c-1.378-.448-3.911-1.1523-4.616.8478-1.1947,3.3896,4.5424,3.9424,4.0841,5.7402-.7346,2.882-3.77,5.5695-6.6578,6.7964-1.2757.542-1.1516,1.9189.0902,2.778,1.3612.9417,3.7878.7195,3.8742,2.0996h0c.6679,2.6703,3.8876,1.164,6.1373,2.1616,2.5191,1.1171,3.6588,2.7213,7.486,2.7237.0058,0,.0173,0,.0231,0Z"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
          {/* Links */}
          <div className="flex-[2] grid grid-cols-2 md:grid-cols-3 gap-16">
            <div>
              <h4 className="font-semibold mb-6 text-gray-200 text-lg uppercase tracking-widest">
                Company
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-gray-400 hover:text-white transition"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/available"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Available Rides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-gray-200 text-lg uppercase tracking-widest">
                Get Involved
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    to="/drive"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Become a Driver
                  </Link>
                </li>
                <li>
                  <Link
                    to="/partner"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Partner with Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/join-as-company"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Join as a Transport Company
                  </Link>
                </li>
                <li>
                  <Link
                    to="/driver-requirements"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Driver Requirements
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-gray-200 text-lg uppercase tracking-widest">
                Contact
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center text-gray-400 hover:text-white transition">
                  <Mail className="h-4 w-4 mr-2" /> support@uniride.ng
                </li>
                <li className="flex items-center text-gray-400 hover:text-white transition">
                  <Phone className="h-4 w-4 mr-2" /> +234 (0) 800 UNIRIDE
                </li>
                <li className="flex items-center text-gray-400 hover:text-white transition">
                  <MapPin className="h-4 w-4 mr-2" /> Lagos, Nigeria
                </li>
                <li className="flex items-center text-gray-400 hover:text-white transition">
                  <Clock className="h-4 w-4 mr-2" /> 24/7 Support
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className=" mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400 text-center md:text-left">
            © {currentYear} Uniride. All rights reserved.
            <br />
            <span className="powered-by text-xs text-gray-400">
              A service by Ride Africa Transport Enterprises.
            </span>
          </div>
          <div className="flex flex-wrap gap-8 text-xs">
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-400 text-xs hidden sm:block ml-4">
              Made with <span className="text-red-500">❤️</span> in Nigeria
            </span>
          </div>
          <span className="text-gray-400 text-xs block sm:hidden mt-6 px-2">
            Made with <span className="text-red-500">❤️</span> in Nigeria
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
