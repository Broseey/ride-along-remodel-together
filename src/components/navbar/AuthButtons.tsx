import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "@shared/contexts/AuthContext";

interface AuthButtonsProps {
  isMobile?: boolean;
  overrideAuthLinks?: { signIn: string; signUp: string };
}

const AuthButtons = ({
  isMobile = false,
  overrideAuthLinks,
}: AuthButtonsProps) => {
  const { user, userProfile } = useAuth();

  if (user && userProfile) {
    return <UserMenu currentUser={userProfile} />;
  }

  const buttonSize = isMobile ? "sm" : "sm";
  const buttonClasses = isMobile ? "text-sm px-3 py-1" : "";

  return (
    <div
      className="flex items-center space-x-2"
      aria-label="Authentication buttons"
    >
      <Link to={overrideAuthLinks?.signIn || "/signin"}>
        <Button
          variant="ghost"
          size={buttonSize}
          className={`text-white hover:bg-transparent hover:text-gray-300 font-medium border-none ${buttonClasses}`}
        >
          Log in
        </Button>
      </Link>
      <Link to={overrideAuthLinks?.signUp || "/signup"}>
        <Button
          variant="default"
          size={buttonSize}
          className={`bg-white text-black hover:bg-gray-100 font-medium ${buttonClasses}`}
        >
          Sign up
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
