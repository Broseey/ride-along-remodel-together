import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@shared/contexts/AuthContext";

const adminLinks = [
  { to: "/admin-dashboard", label: "Dashboard" },
  { to: "/admin-dashboard?tab=rides", label: "Rides" },
  { to: "/admin-dashboard?tab=partners", label: "Partners" },
  { to: "/admin-dashboard?tab=users", label: "Users" },
  { to: "/admin-dashboard?tab=vehicles", label: "Vehicles" },
  { to: "/admin-dashboard?tab=pricing", label: "Pricing" },
];

const AdminNavbar: React.FC = () => {
  const { pathname, search } = useLocation();
  const { signOut, user } = useAuth();

  // Helper to determine if a link is active
  const isActive = (to: string) => {
    const [base, query] = to.split("?");
    if (!query) return pathname === base;
    // For tabs, match both pathname and query string
    return pathname === base && search === `?${query}`;
  };

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link
            to="/admin-dashboard"
            className="font-bold text-xl tracking-tight text-white"
          >
            Uniride Admin
          </Link>
          <div className="hidden md:flex gap-2 ml-8">
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1 rounded transition-colors font-medium border border-transparent
                  ${
                    isActive(link.to)
                      ? "bg-white text-black shadow-sm border-black"
                      : "hover:bg-gray-800 hover:text-white text-gray-200"
                  }
                `}
                style={{ minWidth: 90, textAlign: "center" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          )}
        </div>
      </div>
      {/* Responsive tab bar for mobile */}
      <div className="md:hidden flex gap-2 px-4 pb-2 overflow-x-auto bg-gray-900">
        {adminLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-1 rounded transition-colors font-medium border border-transparent whitespace-nowrap
              ${
                isActive(link.to)
                  ? "bg-white text-black shadow-sm border-black"
                  : "hover:bg-gray-800 hover:text-white text-gray-200"
              }
            `}
            style={{ minWidth: 90, textAlign: "center" }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavbar;
