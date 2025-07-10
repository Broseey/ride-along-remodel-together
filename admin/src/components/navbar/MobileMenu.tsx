import React from "react";
import { Button } from "@/components/ui/button";
import { User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuItem } from "./NavbarTypes";

interface MobileMenuProps {
  menuItems: MenuItem[];
  isAuthenticated: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isDriver?: boolean;
  overrideAuthLinks?: { signIn: string; signUp: string };
}

const MobileMenu = ({
  menuItems,
  isAuthenticated,
  isMenuOpen,
  setIsMenuOpen,
  isDriver = false,
  overrideAuthLinks,
}: MobileMenuProps) => (
  <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:opacity-80"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent
      side="right"
      className="w-full h-full p-0 m-0 max-w-full bg-black text-white border-none"
      aria-label="Mobile navigation menu"
    >
      <div className="flex flex-col h-full">
        {/* Header with close button */}
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-700">
          <Link
            to={isDriver ? "/drive" : "/"}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-white font-bold text-2xl tracking-tight">
              {isDriver ? "Uniride Driver" : "Uniride"}
            </span>
          </Link>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:opacity-80 bg-transparent"
            >
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
        </div>

        {/* Menu items */}
        <div className="flex-1 pt-8">
          {menuItems.map((item) => (
            <SheetClose asChild key={item.label}>
              <Link to={item.path}>
                <div className="py-6 px-6 flex items-center hover:bg-gray-900">
                  <item.icon className="mr-5 h-6 w-6" />
                  <span className="text-xl font-medium">{item.label}</span>
                </div>
              </Link>
            </SheetClose>
          ))}
          {isAuthenticated && (
            <SheetClose asChild>
              <Link to={isDriver ? "/driver-dashboard" : "/dashboard"}>
                <div className="py-6 px-6 flex items-center hover:bg-gray-900">
                  <User className="mr-5 h-6 w-6" />
                  <span className="text-xl font-medium">Dashboard</span>
                </div>
              </Link>
            </SheetClose>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-6 px-6">
          {overrideAuthLinks ? (
            <>
              <Link
                to={overrideAuthLinks.signIn}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="ghost" className="text-white w-full mb-2">
                  Log in
                </Button>
              </Link>
              <Link
                to={overrideAuthLinks.signUp}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="default" className="w-full">
                  Sign up
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default MobileMenu;
