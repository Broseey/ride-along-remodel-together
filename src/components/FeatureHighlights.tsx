
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, DollarSign, Star, MapPin, Car } from "lucide-react";
import IllustrationPlaceholder from "./IllustrationPlaceholder";

const FeatureHighlights = () => {
  const features = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Safe & Secure",
      description: "Every ride is covered with insurance and 24/7 support",
      illustration: <Shield className="h-16 w-16 text-gray-400" />
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: "Fast Pickup",
      description: "Get picked up in minutes, not hours",
      illustration: <Clock className="h-16 w-16 text-gray-400" />
    },
    {
      icon: <DollarSign className="h-12 w-12" />,
      title: "Fair Pricing",
      description: "Transparent pricing with no hidden fees",
      illustration: <DollarSign className="h-16 w-16 text-gray-400" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why choose Uniride?</h2>
          <p className="text-xl text-gray-600">The smarter way to get around campus</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="space-y-6">
              <IllustrationPlaceholder 
                icon={feature.illustration}
                title={`${feature.title} Illustration`}
                height="h-48"
              />
              <Card className="text-center border-none shadow-none">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4 text-black">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
