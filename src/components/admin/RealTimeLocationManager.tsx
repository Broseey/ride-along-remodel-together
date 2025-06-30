
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, MapPin, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RealTimeLocationManager = () => {
  const [newState, setNewState] = useState("");
  const [newUniversity, setNewUniversity] = useState("");
  const queryClient = useQueryClient();

  // Fetch states and universities
  const { data: locations, isLoading } = useQuery({
    queryKey: ['admin-locations'],
    queryFn: async () => {
      const [statesResult, universitiesResult] = await Promise.all([
        supabase.from('nigerian_states').select('*').order('name'),
        supabase.from('nigerian_universities').select('*').order('name')
      ]);
      
      return {
        states: statesResult.data || [],
        universities: universitiesResult.data || []
      };
    },
  });

  // Add state mutation
  const addStateMutation = useMutation({
    mutationFn: async (stateName: string) => {
      const { error } = await supabase
        .from('nigerian_states')
        .insert({ name: stateName, is_active: true });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      setNewState("");
      toast.success("State added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add state");
    }
  });

  // Add university mutation
  const addUniversityMutation = useMutation({
    mutationFn: async (universityName: string) => {
      const { error } = await supabase
        .from('nigerian_universities')
        .insert({ name: universityName, is_active: true });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      setNewUniversity("");
      toast.success("University added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add university");
    }
  });

  // Toggle state status mutation
  const toggleStateMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      const { error } = await supabase
        .from('nigerian_states')
        .update({ is_active: !isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      toast.success("State status updated");
    }
  });

  // Toggle university status mutation
  const toggleUniversityMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      const { error } = await supabase
        .from('nigerian_universities')
        .update({ is_active: !isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      toast.success("University status updated");
    }
  });

  // Remove state mutation
  const removeStateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('nigerian_states')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      toast.success("State removed successfully");
    }
  });

  // Remove university mutation
  const removeUniversityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('nigerian_universities')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      toast.success("University removed successfully");
    }
  });

  const handleAddState = () => {
    if (newState.trim()) {
      addStateMutation.mutate(newState.trim());
    }
  };

  const handleAddUniversity = () => {
    if (newUniversity.trim()) {
      addUniversityMutation.mutate(newUniversity.trim());
    }
  };

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* States Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            States Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter new state name"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddState()}
            />
            <Button 
              onClick={handleAddState}
              disabled={!newState.trim() || addStateMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add State
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {locations?.states.map((state: any) => (
              <div key={state.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className={state.is_active ? "text-black" : "text-gray-400"}>
                    {state.name}
                  </span>
                  <Badge variant={state.is_active ? "default" : "secondary"}>
                    {state.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={state.is_active ? "outline" : "default"}
                    onClick={() => toggleStateMutation.mutate({ id: state.id, isActive: state.is_active })}
                  >
                    {state.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeStateMutation.mutate(state.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Universities Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Universities Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter new university name"
              value={newUniversity}
              onChange={(e) => setNewUniversity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddUniversity()}
            />
            <Button 
              onClick={handleAddUniversity}
              disabled={!newUniversity.trim() || addUniversityMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add University
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {locations?.universities.map((university: any) => (
              <div key={university.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className={university.is_active ? "text-black" : "text-gray-400"}>
                    {university.name}
                  </span>
                  <Badge variant={university.is_active ? "default" : "secondary"}>
                    {university.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={university.is_active ? "outline" : "default"}
                    onClick={() => toggleUniversityMutation.mutate({ id: university.id, isActive: university.is_active })}
                  >
                    {university.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeUniversityMutation.mutate(university.id)}
                  >
                    <Trash2 className="h-3 w-3" />
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

export default RealTimeLocationManager;
