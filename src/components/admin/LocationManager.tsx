
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Trash2, Building2, School } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LocationManager = () => {
  const [newStateName, setNewStateName] = useState('');
  const [newUniversityName, setNewUniversityName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const queryClient = useQueryClient();

  // Sample data for states and universities (you can modify these lists)
  const nigerianStates = [
    'Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Katsina', 'Ogun',
    'Ondo', 'Imo', 'Delta', 'Edo', 'Enugu', 'Anambra', 'Abia', 'Bauchi',
    'Benue', 'Borno', 'Cross River', 'Ebonyi', 'Ekiti', 'Gombe', 'Jigawa',
    'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Osun', 'Plateau',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Adamawa', 'Akwa Ibom', 'Bayelsa'
  ];

  const nigerianUniversities = [
    'University of Lagos (UNILAG)',
    'University of Ibadan (UI)',
    'Obafemi Awolowo University (OAU)',
    'University of Nigeria, Nsukka (UNN)',
    'Ahmadu Bello University (ABU)',
    'University of Port Harcourt (UNIPORT)',
    'Federal University of Technology, Akure (FUTA)',
    'Lagos State University (LASU)',
    'Covenant University',
    'Babcock University',
    'University of Benin (UNIBEN)',
    'Federal University of Technology, Owerri (FUTO)',
    'University of Ilorin (UNILORIN)',
    'Nnamdi Azikiwe University (UNIZIK)',
    'Federal University, Oye-Ekiti (FUOYE)',
    'University of Calabar (UNICAL)',
    'Bayero University, Kano (BUK)',
    'University of Jos (UNIJOS)',
    'Delta State University (DELSU)',
    'Rivers State University (RSU)',
    'Imo State University (IMSU)',
    'Abia State University (ABSU)',
    'Enugu State University of Science and Technology (ESUT)',
    'Anambra State University (ANSU)',
    'Ekiti State University (EKSU)',
    'Adekunle Ajasin University (AAU)',
    'Federal University of Agriculture, Abeokuta (FUNAAB)',
    'University of Agriculture, Makurdi (UAM)',
    'Federal University of Petroleum Resources, Effurun (FUPRE)',
    'Federal University, Birnin Kebbi (FUBK)'
  ];

  // Fetch approved locations
  const { data: approvedStates } = useQuery({
    queryKey: ['approved-states'],
    queryFn: async () => {
      // For now, return the full list of states
      return nigerianStates.map(state => ({ name: state, is_active: true }));
    },
  });

  const { data: approvedUniversities } = useQuery({
    queryKey: ['approved-universities'],
    queryFn: async () => {
      // For now, return the full list of universities
      return nigerianUniversities.map(university => ({ name: university, is_active: true }));
    },
  });

  const addState = useMutation({
    mutationFn: async (stateName: string) => {
      // For this implementation, we'll just add to local state
      // In a real app, you'd save to database
      console.log('Adding state:', stateName);
      return { name: stateName, is_active: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-states'] });
      toast.success('State added successfully!');
      setNewStateName('');
    },
    onError: (error: any) => {
      toast.error('Failed to add state');
      console.error('Error adding state:', error);
    },
  });

  const addUniversity = useMutation({
    mutationFn: async (universityName: string) => {
      // For this implementation, we'll just add to local state
      // In a real app, you'd save to database
      console.log('Adding university:', universityName);
      return { name: universityName, is_active: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-universities'] });
      toast.success('University added successfully!');
      setNewUniversityName('');
    },
    onError: (error: any) => {
      toast.error('Failed to add university');
      console.error('Error adding university:', error);
    },
  });

  const handleAddState = () => {
    if (newStateName.trim()) {
      addState.mutate(newStateName.trim());
    }
  };

  const handleAddUniversity = () => {
    if (newUniversityName.trim()) {
      addUniversity.mutate(newUniversityName.trim());
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
                      <Button onClick={handleAddState} disabled={!newStateName.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add State
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved States</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {approvedStates?.map((state, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{state.name}</span>
                        <Badge variant="default" className="text-xs">Active</Badge>
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
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="universityName">University Name</Label>
                      <Input
                        id="universityName"
                        value={newUniversityName}
                        onChange={(e) => setNewUniversityName(e.target.value)}
                        placeholder="Enter university name"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddUniversity} disabled={!newUniversityName.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add University
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {approvedUniversities?.map((university, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{university.name}</span>
                        <Badge variant="default" className="text-xs">Active</Badge>
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

export default LocationManager;
