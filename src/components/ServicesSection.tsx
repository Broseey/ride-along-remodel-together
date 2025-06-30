
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, Package, Clock } from "lucide-react";
import IllustrationPlaceholder from "./IllustrationPlaceholder";

const ServicesSection = () => {
  const services = [
    {
      icon: <Car className="h-8 w-8" />,
      title: "UniRide",
      description: "Affordable rides for everyday trips around campus",
      illustration: <Car className="h-16 w-16 text-gray-400" />
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "UniPool",
      description: "Share your ride with other students and split the cost",
      illustration: <Users className="h-16 w-16 text-gray-400" />
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "UniDelivery",
      description: "Get food and essentials delivered to your dorm",
      illustration: <Package className="h-16 w-16 text-gray-400" />
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "UniSchedule",
      description: "Schedule rides in advance for important events",
      illustration: <Clock className="h-16 w-16 text-gray-400" />
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Everything you need to get around campus</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="space-y-4">
              <IllustrationPlaceholder 
                icon={service.illustration}
                title={`${service.title} Service Illustration`}
                height="h-40"
              />
              <Card className="h-auto">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black rounded-lg text-white">
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
