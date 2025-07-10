
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import DriverAuthButtons from "./DriverAuthButtons";
import { useMenuItems } from "./useMenuItems";
import { useAuth } from "@shared/contexts/AuthContext";

const DriverNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, driverProfile } = useAuth();

  const isAuthenticated = !!(user && driverProfile);

  // Custom hook to check if screen width is less than 900px
  const [isMobileMenu, setIsMobileMenu] = useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileMenu(window.innerWidth < 900);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = useMenuItems(isAuthenticated, 'driver');

  return (
    <nav className="bg-black py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/drive">
            <span className="text-white font-bold text-2xl tracking-tight">Uniride Driver</span>
          </Link>
        </div>
        
        {/* Desktop menu - shows when screen width >= 900px */}
        {!isMobileMenu && (
          <div className="flex items-center">
            <DesktopMenu menuItems={menuItems} />
          </div>
        )}
        
        {/* Mobile menu and auth buttons - shows when screen width < 900px */}
        {isMobileMenu ? (
          <div className="flex items-center space-x-2">
            {/* Driver auth buttons next to hamburger menu */}
            <DriverAuthButtons isMobile={true} />
            <MobileMenu 
              menuItems={menuItems}
              isAuthenticated={isAuthenticated}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isDriver={true}
            />
          </div>
        ) : (
          /* Desktop driver auth buttons */
          <div className="flex items-center space-x-2">
            <DriverAuthButtons isMobile={false} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default DriverNavbar;
