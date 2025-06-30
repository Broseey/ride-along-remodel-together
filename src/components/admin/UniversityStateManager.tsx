import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Plus, Trash2, Building2, School } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UniversityStateManager = () => {
  const queryClient = useQueryClient();
  const [newStateName, setNewStateName] = useState("");
  const [newUniversityName, setNewUniversityName] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Fetch states
  const { data: states } = useQuery({
    queryKey: ["admin-states"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch universities
  const { data: universities } = useQuery({
    queryKey: ["admin-universities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const addState = useMutation({
    mutationFn: async (stateName: string) => {
      const { error } = await supabase
        .from("states")
        .insert({ name: stateName.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-states"] });
      toast.success("State added successfully!");
      setNewStateName("");
    },
    onError: (error: unknown) => {
      toast.error("Failed to add state");
      console.error("Error adding state:", error);
    },
  });

  const addUniversity = useMutation({
    mutationFn: async ({ name, state }: { name: string; state: string }) => {
      const { error } = await supabase
        .from("universities")
        .insert({ name: name.trim(), state });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
      toast.success("University added successfully!");
      setNewUniversityName("");
      setSelectedState("");
    },
    onError: (error: unknown) => {
      toast.error("Failed to add university");
      console.error("Error adding university:", error);
    },
  });

  const toggleStateStatus = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from("states")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-states"] });
      toast.success("State status updated");
    },
    onError: (error: unknown) => {
      toast.error("Failed to update state status");
      console.error("Error updating state:", error);
    },
  });

  const toggleUniversityStatus = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from("universities")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
      toast.success("University status updated");
    },
    onError: (error: unknown) => {
      toast.error("Failed to update university status");
      console.error("Error updating university:", error);
    },
  });

  const deleteState = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("states").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-states"] });
      toast.success("State deleted");
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete state");
      console.error("Error deleting state:", error);
    },
  });

  const deleteUniversity = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("universities")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
      toast.success("University deleted");
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete university");
      console.error("Error deleting university:", error);
    },
  });

  const handleAddState = () => {
    if (newStateName.trim()) {
      addState.mutate(newStateName.trim());
    }
  };

  const handleAddUniversity = () => {
    if (newUniversityName.trim() && selectedState) {
      addUniversity.mutate({
        name: newUniversityName.trim(),
        state: selectedState,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Management
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage the states and universities available for ride routes
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="states" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="states">States</TabsTrigger>
              <TabsTrigger value="universities">Universities</TabsTrigger>
            </TabsList>

            <TabsContent value="states" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Add New State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="stateName">State Name</Label>
                      <Input
                        id="stateName"
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        placeholder="Enter state name"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleAddState}
                        disabled={!newStateName.trim()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add State
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manage States</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {states?.map((state) => (
                      <div
                        key={state.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{state.name}</span>
                          <Badge
                            variant={state.is_active ? "default" : "secondary"}
                          >
                            {state.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toggleStateStatus.mutate({
                                id: state.id,
                                is_active: !state.is_active,
                              })
                            }
                          >
                            {state.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteState.mutate(state.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="universities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Add New University
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="universityName">University Name</Label>
                      <Input
                        id="universityName"
                        value={newUniversityName}
                        onChange={(e) => setNewUniversityName(e.target.value)}
                        placeholder="Enter university name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="universityState">State</Label>
                      <Select
                        value={selectedState}
                        onValueChange={setSelectedState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states
                            ?.filter((s) => s.is_active)
                            .map((state) => (
                              <SelectItem key={state.id} value={state.name}>
                                {state.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleAddUniversity}
                        disabled={!newUniversityName.trim() || !selectedState}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add University
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manage Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {universities?.map((university) => (
                      <div
                        key={university.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="font-medium">
                              {university.name}
                            </span>
                            <p className="text-sm text-gray-500">
                              {university.state}
                            </p>
                          </div>
                          <Badge
                            variant={
                              university.is_active ? "default" : "secondary"
                            }
                          >
                            {university.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toggleUniversityStatus.mutate({
                                id: university.id,
                                is_active: !university.is_active,
                              })
                            }
                          >
                            {university.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deleteUniversity.mutate(university.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityStateManager;
