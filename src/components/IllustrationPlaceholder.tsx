
import React from "react";
import { Card } from "@/components/ui/card";

interface IllustrationPlaceholderProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
  height?: string;
}

const IllustrationPlaceholder = ({ 
  icon, 
  title, 
  className = "", 
  height = "h-64" 
}: IllustrationPlaceholderProps) => {
  return (
    <Card className={`${height} bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 ${className}`}>
      <div className="mb-4">
        {icon}
      </div>
      <p className="text-sm font-medium text-center">{title}</p>
      <p className="text-xs text-gray-400 mt-1">Image placeholder</p>
    </Card>
  );
};

export default IllustrationPlaceholder;
