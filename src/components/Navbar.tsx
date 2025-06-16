
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DesktopMenu from "./navbar/DesktopMenu";
import MobileMenu from "./navbar/MobileMenu";
import AuthButtons from "./navbar/AuthButtons";
import { useMenuItems } from "./navbar/useMenuItems";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile } = useAuth();

  const isAuthenticated = !!(user && userProfile);

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

  const menuItems = useMenuItems(isAuthenticated, 'user');

  return (
    <nav className="bg-black py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <span className="text-white font-bold text-2xl tracking-tight">Uniride</span>
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
            {/* Auth buttons next to hamburger menu */}
            <AuthButtons isMobile={true} />
            <MobileMenu 
              menuItems={menuItems}
              isAuthenticated={isAuthenticated}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isDriver={false}
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
