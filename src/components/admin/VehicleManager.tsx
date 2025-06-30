import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const initialVehicle = {
  name: "",
  capacity: 4,
  image_url: "",
  description: "",
  base_price: 0,
  is_active: true,
};

const VehicleManager = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialVehicle);

  // Fetch vehicles
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Create or update vehicle
  const upsertMutation = useMutation({
    mutationFn: async (vehicle) => {
      let payload = { ...vehicle };
      if (editingId) payload.id = editingId;
      const { error } = await supabase.from("vehicles").upsert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      setIsCreating(false);
      setEditingId(null);
      setForm(initialVehicle);
      toast.success("Vehicle saved");
    },
    onError: () => toast.error("Failed to save vehicle"),
  });

  // Delete vehicle
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast.success("Vehicle deleted");
    },
    onError: () => toast.error("Failed to delete vehicle"),
  });

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      name: vehicle.name,
      capacity: vehicle.capacity,
      image_url: vehicle.image_url || "",
      description: vehicle.description || "",
      base_price: vehicle.base_price || 0,
      is_active: vehicle.is_active,
    });
    setIsCreating(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.capacity) {
      toast.error("Name and capacity are required");
      return;
    }
    upsertMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vehicle Management</CardTitle>
          <Button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              setForm(initialVehicle);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Vehicle
          </Button>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacity: Number(e.target.value) }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={form.image_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image_url: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Base Price (₦)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.base_price}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      base_price: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Label>Active</Label>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, is_active: v }))
                  }
                />
              </div>
              <div className="col-span-full flex gap-2 mt-4">
                <Button type="submit" disabled={upsertMutation.isLoading}>
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setForm(initialVehicle);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          <div className="space-y-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : vehicles.length === 0 ? (
              <div className="text-gray-500">No vehicles found.</div>
            ) : (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium">{vehicle.name}</p>
                      <p className="text-xs text-gray-500">Name</p>
                    </div>
                    <div>
                      <p className="font-medium">{vehicle.capacity}</p>
                      <p className="text-xs text-gray-500">Capacity</p>
                    </div>
                    <div>
                      <p className="font-medium">
                        ₦{vehicle.base_price?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Base Price</p>
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-xs">
                        {vehicle.image_url}
                      </p>
                      <p className="text-xs text-gray-500">Image URL</p>
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-xs">
                        {vehicle.description}
                      </p>
                      <p className="text-xs text-gray-500">Description</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        vehicle.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {vehicle.is_active ? "Active" : "Inactive"}
                    </span>
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

export default VehicleManager;
