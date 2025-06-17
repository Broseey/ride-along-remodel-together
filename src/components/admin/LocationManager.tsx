
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const LocationManager = () => {
  const [newLocation, setNewLocation] = useState({ name: '', type: 'university', capacity: 20 });
  const queryClient = useQueryClient();

  // Fetch vehicles from database (since locations table doesn't exist, we'll use vehicles for location management)
  const { data: customLocations = [] } = useQuery({
    queryKey: ['custom-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Add location mutation (actually adds a vehicle)
  const addLocationMutation = useMutation({
    mutationFn: async (location: { name: string; type: string; capacity: number }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          name: location.name,
          type: location.type,
          capacity: location.capacity,
          base_price_multiplier: 1.0
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Vehicle added successfully!');
      queryClient.invalidateQueries({ queryKey: ['custom-vehicles'] });
      setNewLocation({ name: '', type: 'university', capacity: 20 });
    },
    onError: (error) => {
      toast.error('Failed to add vehicle');
      console.error('Error adding vehicle:', error);
    },
  });

  // Remove location mutation
  const removeLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', locationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Vehicle removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['custom-vehicles'] });
    },
    onError: (error) => {
      toast.error('Failed to remove vehicle');
      console.error('Error removing vehicle:', error);
    },
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLocation.name.trim()) {
      toast.error('Please enter a vehicle name');
      return;
    }

    addLocationMutation.mutate(newLocation);
  };

  const handleRemoveLocation = (locationId: string) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      removeLocationMutation.mutate(locationId);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleName">Vehicle Name</Label>
                <Input
                  id="vehicleName"
                  placeholder="e.g., Toyota Hiace"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Type</Label>
                <Select
                  value={newLocation.type}
                  onValueChange={(value) => setNewLocation({ ...newLocation, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="50"
                  value={newLocation.capacity}
                  onChange={(e) => setNewLocation({ ...newLocation, capacity: parseInt(e.target.value) })}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={addLocationMutation.isPending}
                >
                  {addLocationMutation.isPending ? 'Adding...' : 'Add Vehicle'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Manage Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customLocations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No vehicles added yet.</p>
          ) : (
            <div className="space-y-3">
              {customLocations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{location.name}</span>
                    <Badge variant={location.type === 'Bus' ? 'default' : 'secondary'}>
                      {location.type}
                    </Badge>
                    <Badge variant="outline">
                      {location.capacity} seats
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveLocation(location.id)}
                    disabled={removeLocationMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationManager;
