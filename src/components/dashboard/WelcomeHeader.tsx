
import React from "react";

interface WelcomeHeaderProps {
  name: string;
}

const WelcomeHeader = ({ name }: WelcomeHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {name}</h1>
      <p className="text-gray-600">Where are you heading to today?</p>
    </div>
  );
};

export default WelcomeHeader;
