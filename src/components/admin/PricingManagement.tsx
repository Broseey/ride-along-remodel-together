import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const PricingManagement = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPricing, setNewPricing] = useState({
    from_type: "",
    from_location: "",
    to_type: "",
    to_location: "",
    vehicle_type: "",
    base_price: "",
  });
  const [pricingMode, setPricingMode] = useState<"route" | "vehicle">("route");

  // Fetch enabled states from Supabase
  const { data: enabledStates = [], isLoading: loadingStates } = useQuery({
    queryKey: ["enabled-states-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("name")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data?.map((s) => s.name) || [];
    },
  });

  // Fetch enabled universities from Supabase
  const { data: enabledUniversities = [], isLoading: loadingUniversities } =
    useQuery({
      queryKey: ["enabled-universities-admin"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("universities")
          .select("name")
          .eq("is_active", true)
          .order("name");
        if (error) throw error;
        return data?.map((u) => u.name) || [];
      },
    });

  // Fetch pricing rules from Supabase (dynamic table based on mode)
  const { data: pricing = [], isLoading } = useQuery({
    queryKey: [
      pricingMode === "route"
        ? "route-pricing-table-admin"
        : "vehicle-pricing-table-admin",
    ],
    queryFn: async () => {
      if (pricingMode === "route") {
        const { data, error } = await supabase
          .from("route_pricing")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      } else {
        const { data, error } = await supabase
          .from("route_vehicle_pricing")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      }
    },
  });

  // Create new pricing rule for both modes
  const createMutation = useMutation({
    mutationFn: async (item: Record<string, unknown>) => {
      const { error } = await supabase.from("pricing").insert([item]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-table-admin"] });
      setIsCreating(false);
      setNewPricing({
        from_type: "",
        from_location: "",
        to_type: "",
        to_location: "",
        vehicle_type: "",
        base_price: "",
      });
      toast.success("Pricing rule created successfully");
    },
    onError: () => toast.error("Failed to create pricing rule"),
  });

  // Update price
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Record<string, unknown> & { table?: string };
    }) => {
      const table = (updates.table as string) || "route_pricing";
      const priceColumn = "base_price";
      const priceValue = updates[priceColumn];
      const { error } = await supabase
        .from(table)
        .update({ [priceColumn]: priceValue })
        .eq("id", id);
      if (error) {
        // Log error details for debugging
        if (typeof error === "object") {
          console.error("Supabase update error:", {
            message: error.message,
            details: error.details,
            code: error.code,
            id,
            table,
            priceColumn,
            priceValue,
          });
        } else {
          console.error("Supabase update error:", error);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          pricingMode === "route"
            ? "route-pricing-table-admin"
            : "vehicle-pricing-table-admin",
        ],
      });
      setEditingId(null);
      toast.success("Price updated successfully");
    },
    onError: (err) => {
      toast.error("Failed to update price");
      if (err) {
        if (typeof err === "object") {
          console.error("Update price error:", {
            message: err.message,
            details: err.details,
            code: err.code,
          });
        } else {
          console.error("Update price error:", err);
        }
      }
    },
  });

  // Toggle active
  const toggleActiveMutation = useMutation({
    mutationFn: async ({
      id,
      is_active,
      table,
    }: {
      id: string;
      is_active: boolean;
      table?: string;
    }) => {
      const tbl = table || "route_pricing";
      // Now both tables have is_active, so always update it
      const { error } = await supabase
        .from(tbl)
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          pricingMode === "route"
            ? "route-pricing-table-admin"
            : "vehicle-pricing-table-admin",
        ],
      });
      toast.success("Pricing rule updated");
    },
    onError: () => toast.error("Failed to update rule"),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async ({ id, table }: { id: string; table?: string }) => {
      const tbl = table || "route_pricing";
      const { error } = await supabase.from(tbl).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          pricingMode === "route"
            ? "route-pricing-table-admin"
            : "vehicle-pricing-table-admin",
        ],
      });
      toast.success("Pricing rule deleted");
    },
    onError: () => toast.error("Failed to delete rule"),
  });

  const handleCreate = async () => {
    if (
      !newPricing.from_type ||
      !newPricing.from_location ||
      !newPricing.to_type ||
      !newPricing.to_location ||
      (pricingMode === "vehicle" && !newPricing.vehicle_type) ||
      !newPricing.base_price
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    setCreatingLoading(true);
    try {
      const payload: Record<string, string | number> = {
        from_type: newPricing.from_type, // ensure from_type is included
        from_location: newPricing.from_location,
        to_type: newPricing.to_type, // ensure to_type is included
        to_location: newPricing.to_location,
        base_price: Number(newPricing.base_price),
      };
      let table = "route_pricing";
      if (pricingMode === "vehicle") {
        payload.vehicle_type = newPricing.vehicle_type;
        table = "route_vehicle_pricing";
      }
      // Debug log
      console.log(
        "[PricingManagement] Creating pricing rule with payload:",
        payload,
        "table:",
        table
      );
      const { error } = await supabase.from(table).insert([payload]);
      if (error) {
        console.error(
          "[PricingManagement] Supabase error creating pricing rule:",
          error,
          "\nStringified:",
          JSON.stringify(error, null, 2),
          "\nMessage:",
          error.message,
          "\nDetails:",
          error.details,
          "\nCode:",
          error.code,
          "\nPayload:",
          payload
        );
        toast.error(
          "Failed to create pricing rule: " +
            (error.message || error.details || "Unknown error")
        );
        return;
      }
      setIsCreating(false);
      setNewPricing({
        from_type: "",
        from_location: "",
        to_type: "",
        to_location: "",
        vehicle_type: "",
        base_price: "",
      });
      queryClient.invalidateQueries({
        queryKey: [
          pricingMode === "route"
            ? "route-pricing-table-admin"
            : "vehicle-pricing-table-admin",
        ],
      });
      toast.success("Pricing rule created successfully");
    } finally {
      setCreatingLoading(false);
    }
  };

  const handleToggleActive = (id: string, is_active: boolean) => {
    const table =
      pricingMode === "route" ? "route_pricing" : "route_vehicle_pricing";
    toggleActiveMutation.mutate({ id, is_active: !is_active, table });
  };

  const handleDelete = (id: string) => {
    const table =
      pricingMode === "route" ? "route_pricing" : "route_vehicle_pricing";
    deleteMutation.mutate({ id, table });
  };

  const handlePriceUpdate = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    const table =
      pricingMode === "route" ? "route_pricing" : "route_vehicle_pricing";
    // Always send the correct column and value
    if (pricingMode === "route") {
      updateMutation.mutate({ id, updates: { base_price: price, table } });
    } else {
      updateMutation.mutate({ id, updates: { base_price: price, table } });
    }
  };

  // Fetch vehicles from Supabase (admin-controlled)
  const { data: vehicles = [], isLoading: loadingVehicles } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing Management</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={pricingMode === "route" ? "default" : "outline"}
              onClick={() => setPricingMode("route")}
            >
              Route Pricing
            </Button>
            <Button
              variant={pricingMode === "vehicle" ? "default" : "outline"}
              onClick={() => setPricingMode("vehicle")}
            >
              Per-Vehicle Pricing
            </Button>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New {pricingMode === "route" ? "Route" : "Vehicle"}
          </Button>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-4">Create New Pricing Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FROM TYPE & LOCATION */}
                <div>
                  <Label>From Type</Label>
                  <Select
                    value={newPricing.from_type}
                    onValueChange={(v) =>
                      setNewPricing((p) => ({
                        ...p,
                        from_type: v,
                        from_location: "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                    </SelectContent>
                  </Select>
                  {newPricing.from_type && (
                    <div className="mt-2">
                      <Label>From Location</Label>
                      <Select
                        value={newPricing.from_location}
                        onValueChange={(v) =>
                          setNewPricing((p) => ({ ...p, from_location: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${newPricing.from_type}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(newPricing.from_type === "state"
                            ? enabledStates
                            : enabledUniversities
                          ).map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                {/* TO TYPE & LOCATION */}
                <div>
                  <Label>To Type</Label>
                  <Select
                    value={newPricing.to_type}
                    onValueChange={(v) =>
                      setNewPricing((p) => ({
                        ...p,
                        to_type: v,
                        to_location: "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                    </SelectContent>
                  </Select>
                  {newPricing.to_type && (
                    <div className="mt-2">
                      <Label>To Location</Label>
                      <Select
                        value={newPricing.to_location}
                        onValueChange={(v) =>
                          setNewPricing((p) => ({ ...p, to_location: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${newPricing.to_type}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(newPricing.to_type === "state"
                            ? enabledStates
                            : enabledUniversities
                          ).map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                {/* VEHICLE TYPE (only for per-vehicle mode) */}
                {pricingMode === "vehicle" && (
                  <div>
                    <Label>Vehicle Type</Label>
                    <Select
                      value={newPricing.vehicle_type}
                      onValueChange={(value) =>
                        setNewPricing((p) => ({ ...p, vehicle_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.name}>
                            {vehicle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {/* PRICE */}
                <div>
                  <Label>Base Price (₦)</Label>
                  <Input
                    type="number"
                    placeholder="1200"
                    value={newPricing.base_price}
                    onChange={(e) =>
                      setNewPricing((p) => ({
                        ...p,
                        base_price: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreate} disabled={creatingLoading}>
                  {creatingLoading ? "Creating..." : "Create"}
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : pricing.length === 0 ? (
              <div className="text-gray-500">No pricing rules found.</div>
            ) : (
              pricing.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium">{item.from_location}</p>
                      <p className="text-xs text-gray-500">From</p>
                    </div>
                    <div>
                      <p className="font-medium">{item.to_location}</p>
                      <p className="text-xs text-gray-500">To</p>
                    </div>
                    {pricingMode === "vehicle" && (
                      <div>
                        <p className="font-medium">{item.vehicle_type}</p>
                        <p className="text-sm text-gray-500">Vehicle</p>
                      </div>
                    )}
                    <div>
                      {editingId === item.id ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            defaultValue={item.base_price}
                            className="w-24"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handlePriceUpdate(
                                  item.id,
                                  (e.target as HTMLInputElement).value
                                );
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              const input = (e) => {
                                const parent = e.target.closest("div.flex");
                                return parent
                                  ? parent.querySelector('input[type="number"]')
                                  : null;
                              };
                              const inputElem = input(event);
                              if (inputElem) {
                                handlePriceUpdate(item.id, inputElem.value);
                              }
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            ₦{item.base_price?.toLocaleString()}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(item.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">Base Price</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.is_active ? "default" : "secondary"}>
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleActive(item.id, item.is_active)
                      }
                    >
                      {item.is_active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingManagement;
