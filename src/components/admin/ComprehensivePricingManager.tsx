
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RouteVehiclePricing {
  id: string;
  from_location: string;
  to_location: string;
  vehicle_type: string;
  base_price: number;
  is_active: boolean;
}

const ComprehensivePricingManager = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPricing, setNewPricing] = useState({
    from_location: '',
    to_location: '',
    vehicle_type: '',
    base_price: ''
  });

  // Fetch states and universities
  const { data: states } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('states')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: universities } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch route pricing
  const { data: routePricing } = useQuery({
    queryKey: ['route-vehicle-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_vehicle_pricing')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as RouteVehiclePricing[];
    },
  });

  const vehicleTypes = [
    'Bus', 'Mini Bus', 'Van', 'SUV', 'Sedan', 'Coaster', 'Sprinter'
  ];

  const locations = [
    ...(states?.map(s => s.name) || []),
    ...(universities?.map(u => u.name) || [])
  ];

  const createPricing = useMutation({
    mutationFn: async (data: typeof newPricing) => {
      const { error } = await supabase
        .from('route_vehicle_pricing')
        .insert({
          from_location: data.from_location,
          to_location: data.to_location,
          vehicle_type: data.vehicle_type,
          base_price: parseFloat(data.base_price)
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route-vehicle-pricing'] });
      setNewPricing({ from_location: '', to_location: '', vehicle_type: '', base_price: '' });
      setIsCreating(false);
      toast.success('Pricing rule created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create pricing rule');
      console.error('Error creating pricing:', error);
    },
  });

  const updatePricing = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      const { error } = await supabase
        .from('route_vehicle_pricing')
        .update({ base_price: price })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route-vehicle-pricing'] });
      setEditingId(null);
      toast.success('Price updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update price');
      console.error('Error updating price:', error);
    },
  });

  const togglePricingStatus = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('route_vehicle_pricing')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route-vehicle-pricing'] });
      toast.success('Pricing rule updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update pricing rule');
      console.error('Error updating pricing:', error);
    },
  });

  const deletePricing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('route_vehicle_pricing')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route-vehicle-pricing'] });
      toast.success('Pricing rule deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete pricing rule');
      console.error('Error deleting pricing:', error);
    },
  });

  const handleCreate = () => {
    if (!newPricing.from_location || !newPricing.to_location || 
        !newPricing.vehicle_type || !newPricing.base_price) {
      toast.error('Please fill in all fields');
      return;
    }
    createPricing.mutate(newPricing);
  };

  const handlePriceUpdate = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    updatePricing.mutate({ id, price });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Route Pricing Management
          </CardTitle>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Route
          </Button>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-4">Create New Pricing Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>From Location</Label>
                  <Select value={newPricing.from_location} onValueChange={(value) => 
                    setNewPricing({...newPricing, from_location: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>To Location</Label>
                  <Select value={newPricing.to_location} onValueChange={(value) => 
                    setNewPricing({...newPricing, to_location: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Vehicle Type</Label>
                  <Select value={newPricing.vehicle_type} onValueChange={(value) => 
                    setNewPricing({...newPricing, vehicle_type: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(vehicle => (
                        <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Base Price (₦)</Label>
                  <Input
                    type="number"
                    placeholder="2500"
                    value={newPricing.base_price}
                    onChange={(e) => setNewPricing({...newPricing, base_price: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreate}>Create</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {routePricing?.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-medium">{item.from_location}</p>
                    <p className="text-sm text-gray-500">From</p>
                  </div>
                  <div>
                    <p className="font-medium">{item.to_location}</p>
                    <p className="text-sm text-gray-500">To</p>
                  </div>
                  <div>
                    <p className="font-medium">{item.vehicle_type}</p>
                    <p className="text-sm text-gray-500">Vehicle</p>
                  </div>
                  <div>
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          defaultValue={item.base_price}
                          className="w-24"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handlePriceUpdate(item.id, (e.target as HTMLInputElement).value);
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const input = document.querySelector(`input[defaultValue="${item.base_price}"]`) as HTMLInputElement;
                            if (input) handlePriceUpdate(item.id, input.value);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium">₦{item.base_price.toLocaleString()}</p>
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
                    onClick={() => togglePricingStatus.mutate({ id: item.id, is_active: !item.is_active })}
                  >
                    {item.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePricing.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensivePricingManager;
