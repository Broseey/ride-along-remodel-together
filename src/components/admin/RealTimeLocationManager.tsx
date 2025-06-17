
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, MapPin, Building2 } from "lucide-react";
import { toast } from "sonner";

// Static data for Nigerian states and universities
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const NIGERIAN_UNIVERSITIES = [
  "University of Lagos", "University of Ibadan", "Obafemi Awolowo University",
  "University of Nigeria, Nsukka", "Ahmadu Bello University", "University of Benin",
  "University of Port Harcourt", "University of Calabar", "Federal University of Technology, Akure",
  "Lagos State University", "Covenant University", "Babcock University",
  "Federal University of Technology, Owerri", "University of Ilorin", "Bayero University",
  "Federal University of Agriculture, Abeokuta", "Nnamdi Azikiwe University",
  "University of Jos", "Delta State University", "Ekiti State University"
];

const RealTimeLocationManager = () => {
  const [activeStates, setActiveStates] = useState<string[]>(NIGERIAN_STATES.slice(0, 10));
  const [activeUniversities, setActiveUniversities] = useState<string[]>(NIGERIAN_UNIVERSITIES.slice(0, 10));
  const [newState, setNewState] = useState("");
  const [newUniversity, setNewUniversity] = useState("");

  const handleAddState = () => {
    if (newState.trim() && !activeStates.includes(newState.trim())) {
      setActiveStates([...activeStates, newState.trim()]);
      setNewState("");
      toast.success("State added successfully");
    } else if (activeStates.includes(newState.trim())) {
      toast.error("State already exists");
    }
  };

  const handleAddUniversity = () => {
    if (newUniversity.trim() && !activeUniversities.includes(newUniversity.trim())) {
      setActiveUniversities([...activeUniversities, newUniversity.trim()]);
      setNewUniversity("");
      toast.success("University added successfully");
    } else if (activeUniversities.includes(newUniversity.trim())) {
      toast.error("University already exists");
    }
  };

  const handleRemoveState = (stateToRemove: string) => {
    setActiveStates(activeStates.filter(state => state !== stateToRemove));
    toast.success("State removed successfully");
  };

  const handleRemoveUniversity = (universityToRemove: string) => {
    setActiveUniversities(activeUniversities.filter(university => university !== universityToRemove));
    toast.success("University removed successfully");
  };

  const toggleStateStatus = (state: string) => {
    // For demo purposes, we'll just show a toast
    toast.success("State status updated");
  };

  const toggleUniversityStatus = (university: string) => {
    // For demo purposes, we'll just show a toast
    toast.success("University status updated");
  };

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
              disabled={!newState.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add State
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {activeStates.map((state, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className="text-black">{state}</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStateStatus(state)}
                  >
                    Disable
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveState(state)}
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
              disabled={!newUniversity.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add University
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {activeUniversities.map((university, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className="text-black">{university}</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleUniversityStatus(university)}
                  >
                    Disable
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveUniversity(university)}
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
