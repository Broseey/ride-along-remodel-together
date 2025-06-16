
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface RouteProps {
  from: string;
  to: string;
  price: string;
}

const QuickRoutes = ({ routes }: { routes: RouteProps[] }) => {
  const navigate = useNavigate();

  const handleRouteSelect = (route: RouteProps) => {
    // Navigate to the main page with the route preselected
    navigate('/', { 
      state: { 
        preselectedRoute: {
          from: route.from,
          to: route.to
        }
      }
    });
    
    // Scroll to booking form
    setTimeout(() => {
      const bookingForm = document.querySelector('[data-booking-form]');
      if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Route Selection</CardTitle>
        <CardDescription>Popular routes for your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {routes.map((route, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between p-3 h-auto hover:bg-gray-50"
              onClick={() => handleRouteSelect(route)}
            >
              <div className="flex items-center">
                <div className="min-w-[24px] mr-4 flex flex-col items-center">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-6 border-l border-dashed border-gray-300"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{route.from} → {route.to}</p>
                  <p className="text-xs text-gray-500">Starting from {route.price}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickRoutes;
