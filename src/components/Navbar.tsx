import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DesktopMenu from "./navbar/DesktopMenu";
import MobileMenu from "./navbar/MobileMenu";
import AuthButtons from "./navbar/AuthButtons";
import { useMenuItems } from "./navbar/useMenuItems";
import { useAuth } from "@shared/contexts/AuthContext";
import { useIsMobile } from "@shared/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const isMobileMenu = useIsMobile();
  const isAuthenticated = !!user;

  // Determine user type for menu
  let userType: "user" | "driver" = "user";
  let overrideAuthLinks: { signIn: string; signUp: string } | undefined =
    undefined;
  if (
    location.pathname.startsWith("/driver-signin") ||
    location.pathname.startsWith("/driver-signup")
  ) {
    userType = "driver";
    overrideAuthLinks = { signIn: "/driver-signin", signUp: "/driver-signup" };
  } else if (userProfile?.is_driver) {
    userType = "driver";
  }
  // Use correct menu items
  const menuItems = useMenuItems(isAuthenticated, userType);

  return (
    <nav className="bg-black py-4 px-6" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <span className="text-white font-bold text-2xl tracking-tight">
              Uniride
            </span>
          </Link>
        </div>

        {/* Desktop menu - shows when screen width >= 900px */}
        {!isMobileMenu && (
          <div className="flex items-center">
            <DesktopMenu
              menuItems={menuItems}
              overrideAuthLinks={overrideAuthLinks}
            />
          </div>
        )}

        {/* Mobile menu and auth buttons - shows when screen width < 900px */}
        {isMobileMenu ? (
          <div className="flex items-center space-x-2">
            {/* Auth buttons next to hamburger menu */}
            <AuthButtons
              isMobile={true}
              overrideAuthLinks={overrideAuthLinks}
            />
            <MobileMenu
              menuItems={menuItems}
              isAuthenticated={isAuthenticated}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isDriver={userType === "driver"}
              overrideAuthLinks={overrideAuthLinks}
            />
          </div>
        ) : (
          /* Desktop auth buttons */
          <div className="flex items-center space-x-2">
            <AuthButtons isMobile={false} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
