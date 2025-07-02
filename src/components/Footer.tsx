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
              {/* Social icons: Instagram, WhatsApp, TikTok, LinkedIn (student-focused) */}
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-400 hover:scale-110 group"
                aria-label="Instagram"
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
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-neutral-700 hover:scale-110 group"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                  imageRendering="optimizeQuality"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  viewBox="0 0 510 512.459"
                  width="1.2em"
                  height="1.2em"
                >
                  <path
                    fill="#ffffff"
                    d="M435.689 74.468C387.754 26.471 324 .025 256.071 0 116.098 0 2.18 113.906 2.131 253.916c-.024 44.758 11.677 88.445 33.898 126.946L0 512.459l134.617-35.311c37.087 20.238 78.85 30.891 121.345 30.903h.109c139.949 0 253.88-113.917 253.928-253.928.024-67.855-26.361-131.645-74.31-179.643v-.012zm-179.618 390.7h-.085c-37.868-.011-75.016-10.192-107.428-29.417l-7.707-4.577-79.886 20.953 21.32-77.889-5.017-7.987c-21.125-33.605-32.29-72.447-32.266-112.322.049-116.366 94.729-211.046 211.155-211.046 56.373.025 109.364 22.003 149.214 61.903 39.853 39.888 61.781 92.927 61.757 149.313-.05 116.377-94.728 211.058-211.057 211.058v.011zm115.768-158.067c-6.344-3.178-37.537-18.52-43.358-20.639-5.82-2.119-10.044-3.177-14.27 3.178-4.225 6.357-16.388 20.651-20.09 24.875-3.702 4.238-7.403 4.762-13.747 1.583-6.343-3.178-26.787-9.874-51.029-31.487-18.86-16.827-31.597-37.598-35.297-43.955-3.702-6.355-.39-9.789 2.775-12.943 2.849-2.848 6.344-7.414 9.522-11.116s4.225-6.355 6.343-10.581c2.12-4.238 1.06-7.937-.522-11.117-1.584-3.177-14.271-34.409-19.568-47.108-5.151-12.37-10.385-10.69-14.269-10.897-3.703-.183-7.927-.219-12.164-.219s-11.105 1.582-16.925 7.939c-5.82 6.354-22.209 21.709-22.209 52.927 0 31.22 22.733 61.405 25.911 65.642 3.177 4.237 44.745 68.318 108.389 95.812 15.135 6.538 26.957 10.446 36.175 13.368 15.196 4.834 29.027 4.153 39.96 2.52 12.19-1.825 37.54-15.353 42.824-30.172 5.283-14.818 5.283-27.529 3.701-30.172-1.582-2.641-5.819-4.237-12.163-7.414l.011-.024z"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-neutral-700 hover:scale-110 group"
                aria-label="TikTok"
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
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-neutral-700 hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
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
          <div className="text-xs text-gray-400">
            © {currentYear} Uniride. All rights reserved.
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
