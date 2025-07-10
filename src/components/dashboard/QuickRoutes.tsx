import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@shared/components/ui/card";
import { ChevronRight } from "lucide-react";
import { supabase } from "@shared/integrations/supabase/client";

interface QuickRoute {
  id: string;
  from: string;
  from_type: "state" | "university";
  to: string;
  to_type: "state" | "university";
  order?: number;
  enabled: boolean;
}

interface RouteWithPrice extends QuickRoute {
  price: string;
}

const QuickRoutes = () => {
  const [routes, setRoutes] = useState<RouteWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      // Fetch all quick routes, sorted by order (show enabled and disabled)
      const { data: quickRoutes, error: quickRoutesError } = await supabase
        .from("quick_routes")
        .select("id, from, from_type, to, to_type, order, enabled")
        .order("order", { ascending: true });
      if (quickRoutesError) {
        setLoading(false);
        return;
      }
      // For each quick route, fetch the current base_price
      const routePromises = quickRoutes.map(async (route: QuickRoute) => {
        // Determine which columns to match in route_pricing
        let fromValue = route.from;
        let toValue = route.to;
        if (route.from_type === "university" && route.to_type === "state") {
          // For university → state, swap the values for the price lookup
          fromValue = route.from;
          toValue = route.to;
          // Try both directions for price lookup
          let pricing = null;
          let { data } = await supabase
            .from("route_pricing")
            .select("base_price")
            .eq("from_location", fromValue)
            .eq("to_location", toValue)
            .single();
          if (!data) {
            // Try the reverse direction
            const { data: reverse } = await supabase
              .from("route_pricing")
              .select("base_price")
              .eq("from_location", toValue)
              .eq("to_location", fromValue)
              .single();
            data = reverse;
          }
          const price = data && data.base_price ? `₦${data.base_price}` : "N/A";
          return { ...route, price };
        } else {
          const { data: pricing } = await supabase
            .from("route_pricing")
            .select("base_price")
            .eq("from_location", fromValue)
            .eq("to_location", toValue)
            .single();
          const price =
            pricing && pricing.base_price ? `₦${pricing.base_price}` : "N/A";
          return { ...route, price };
        }
      });
      const routesWithPrices = await Promise.all(routePromises);
      // Show only enabled routes by default, but you can filter in the UI if needed
      setRoutes(routesWithPrices.filter((r) => r.enabled));
      setLoading(false);
    };
    fetchRoutes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Route Selection</CardTitle>
        <CardDescription>Popular routes for your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : routes.length === 0 ? (
            <div className="text-center text-gray-400">
              No quick routes available.
            </div>
          ) : (
            routes.map((route, index) => (
              <Link
                to="/schedule"
                key={route.id}
                state={{
                  prefilledRoute: {
                    from: route.from,
                    to: route.to,
                  },
                }}
              >
                <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <div className="min-w-[24px] mr-4 flex flex-col items-center">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <div className="h-6 border-l border-dashed border-gray-300"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {route.from}{" "}
                        <span className="text-xs text-gray-400">
                          ({route.from_type})
                        </span>{" "}
                        → {route.to}{" "}
                        <span className="text-xs text-gray-400">
                          ({route.to_type})
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Starting from {route.price}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickRoutes;
