import React from "react";
import FirstImage from "../assets/images/Gemini_Generated_Image_qrymg1qrymg1qrym.png";
const HeroImage: React.FC = () => {
  return (
    <div className="relative h-full w-full flex items-top justify-center overflow-hidden rounded-[3.5rem] md:rounded-[5.5rem]">
      <div className="relative w-full h-[500px] rounded-[3.5rem] md:rounded-[5.5rem] shadow-lg overflow-hidden">
      <img
        src={FirstImage}
        alt="Car sharing concept illustration"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none rounded-[3.5rem] md:rounded-[5.5rem]" />
      </div>
    </div>
  );
};

export default HeroImage;
