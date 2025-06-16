
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
  const [newLocation, setNewLocation] = useState({ name: '', type: 'university' });
  const queryClient = useQueryClient();

  // Fetch custom locations from database
  const { data: customLocations = [] } = useQuery({
    queryKey: ['custom-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Add location mutation
  const addLocationMutation = useMutation({
    mutationFn: async (location: { name: string; type: string }) => {
      const { data, error } = await supabase
        .from('locations')
        .insert([{
          name: location.name,
          type: location.type,
          is_active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Location added successfully!');
      queryClient.invalidateQueries({ queryKey: ['custom-locations'] });
      setNewLocation({ name: '', type: 'university' });
    },
    onError: (error) => {
      toast.error('Failed to add location');
      console.error('Error adding location:', error);
    },
  });

  // Remove location mutation
  const removeLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Location removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['custom-locations'] });
    },
    onError: (error) => {
      toast.error('Failed to remove location');
      console.error('Error removing location:', error);
    },
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLocation.name.trim()) {
      toast.error('Please enter a location name');
      return;
    }

    addLocationMutation.mutate(newLocation);
  };

  const handleRemoveLocation = (locationId: string) => {
    if (confirm('Are you sure you want to remove this location?')) {
      removeLocationMutation.mutate(locationId);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  placeholder="e.g., University of Lagos"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationType">Type</Label>
                <Select
                  value={newLocation.type}
                  onValueChange={(value) => setNewLocation({ ...newLocation, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={addLocationMutation.isPending}
                >
                  {addLocationMutation.isPending ? 'Adding...' : 'Add Location'}
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
            Manage Custom Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customLocations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No custom locations added yet.</p>
          ) : (
            <div className="space-y-3">
              {customLocations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{location.name}</span>
                    <Badge variant={location.type === 'university' ? 'default' : 'secondary'}>
                      {location.type}
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
