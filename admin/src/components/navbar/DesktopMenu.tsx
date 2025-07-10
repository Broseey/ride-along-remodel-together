import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./NavbarTypes";

interface DesktopMenuProps {
  menuItems: MenuItem[];
  overrideAuthLinks?: { signIn: string; signUp: string };
}

const DesktopMenu = ({ menuItems, overrideAuthLinks }: DesktopMenuProps) => (
  <NavigationMenu aria-label="Desktop navigation menu">
    <NavigationMenuList className="bg-transparent border-none">
      {menuItems.map((item) => (
        <NavigationMenuItem key={item.label}>
          <Link to={item.path}>
            <div className="flex items-center gap-2 px-4 py-2 text-white hover:opacity-80 transition-opacity">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
          </Link>
        </NavigationMenuItem>
      ))}
      {/* Auth buttons for desktop menu (driver override) */}
      {overrideAuthLinks && (
        <>
          <NavigationMenuItem>
            <Link to={overrideAuthLinks.signIn}>
              <div className="flex items-center gap-2 px-4 py-2 text-white hover:opacity-80 transition-opacity">
                Log in
              </div>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to={overrideAuthLinks.signUp}>
              <div className="flex items-center gap-2 px-4 py-2 text-white hover:opacity-80 transition-opacity">
                Sign up
              </div>
            </Link>
          </NavigationMenuItem>
        </>
      )}
    </NavigationMenuList>
  </NavigationMenu>
);

export default DesktopMenu;
