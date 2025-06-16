
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface University {
  id: string;
  name: string;
  state: string;
}

interface State {
  id: string;
  name: string;
}

interface PricingRule {
  id: string;
  fromType: 'university' | 'state';
  toType: 'university' | 'state';
  fromLocation: string;
  toLocation: string;
  basePrice: number;
  vehicleMultipliers: {
    sienna: number;
    hiace: number;
    longBus: number;
    corolla: number;
  };
}

const LocationManagement = () => {
  const [universities, setUniversities] = useState<University[]>([
    { id: '1', name: 'University of Lagos', state: 'Lagos' },
    { id: '2', name: 'Ahmadu Bello University', state: 'Kaduna' },
    { id: '3', name: 'University of Ibadan', state: 'Oyo' },
    { id: '4', name: 'Obafemi Awolowo University', state: 'Osun' },
  ]);

  const [states, setStates] = useState<State[]>([
    { id: '1', name: 'Lagos' },
    { id: '2', name: 'Abuja' },
    { id: '3', name: 'Rivers' },
    { id: '4', name: 'Kano' },
    { id: '5', name: 'Oyo' },
    { id: '6', name: 'Kaduna' },
    { id: '7', name: 'Osun' },
  ]);

  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: '1',
      fromType: 'university',
      toType: 'state',
      fromLocation: 'University of Lagos',
      toLocation: 'Lagos',
      basePrice: 2000,
      vehicleMultipliers: { sienna: 1.0, hiace: 1.4, longBus: 1.6, corolla: 0.7 }
    }
  ]);

  const [editingUniversity, setEditingUniversity] = useState<string | null>(null);
  const [editingState, setEditingState] = useState<string | null>(null);
  const [editingPricing, setEditingPricing] = useState<string | null>(null);

  const [newUniversity, setNewUniversity] = useState({ name: '', state: '' });
  const [newState, setNewState] = useState({ name: '' });
  const [newPricingRule, setNewPricingRule] = useState<Partial<PricingRule>>({
    fromType: 'university',
    toType: 'state',
    fromLocation: '',
    toLocation: '',
    basePrice: 0,
    vehicleMultipliers: { sienna: 1.0, hiace: 1.4, longBus: 1.6, corolla: 0.7 }
  });

  // University Management
  const addUniversity = () => {
    if (newUniversity.name && newUniversity.state) {
      const id = Date.now().toString();
      setUniversities([...universities, { id, ...newUniversity }]);
      setNewUniversity({ name: '', state: '' });
      toast.success('University added successfully');
    }
  };

  const updateUniversity = (id: string, updates: Partial<University>) => {
    setUniversities(universities.map(uni => 
      uni.id === id ? { ...uni, ...updates } : uni
    ));
    setEditingUniversity(null);
    toast.success('University updated successfully');
  };

  const deleteUniversity = (id: string) => {
    setUniversities(universities.filter(uni => uni.id !== id));
    toast.success('University deleted successfully');
  };

  // State Management
  const addState = () => {
    if (newState.name) {
      const id = Date.now().toString();
      setStates([...states, { id, ...newState }]);
      setNewState({ name: '' });
      toast.success('State added successfully');
    }
  };

  const updateState = (id: string, updates: Partial<State>) => {
    setStates(states.map(state => 
      state.id === id ? { ...state, ...updates } : state
    ));
    setEditingState(null);
    toast.success('State updated successfully');
  };

  const deleteState = (id: string) => {
    setStates(states.filter(state => state.id !== id));
    toast.success('State deleted successfully');
  };

  // Pricing Management
  const addPricingRule = () => {
    if (newPricingRule.fromLocation && newPricingRule.toLocation && newPricingRule.basePrice) {
      const id = Date.now().toString();
      setPricingRules([...pricingRules, { id, ...newPricingRule } as PricingRule]);
      setNewPricingRule({
        fromType: 'university',
        toType: 'state',
        fromLocation: '',
        toLocation: '',
        basePrice: 0,
        vehicleMultipliers: { sienna: 1.0, hiace: 1.4, longBus: 1.6, corolla: 0.7 }
      });
      toast.success('Pricing rule added successfully');
    }
  };

  const updatePricingRule = (id: string, updates: Partial<PricingRule>) => {
    setPricingRules(pricingRules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
    setEditingPricing(null);
    toast.success('Pricing rule updated successfully');
  };

  const deletePricingRule = (id: string) => {
    setPricingRules(pricingRules.filter(rule => rule.id !== id));
    toast.success('Pricing rule deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Location & Pricing Management</h2>
        <p className="text-gray-600">Manage universities, states, and pricing rules for rides.</p>
      </div>

      <Tabs defaultValue="universities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="universities">
          <Card>
            <CardHeader>
              <CardTitle>Universities</CardTitle>
              <CardDescription>Manage the list of universities available for booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new university */}
              <div className="flex gap-2">
                <Input
                  placeholder="University name"
                  value={newUniversity.name}
                  onChange={(e) => setNewUniversity({...newUniversity, name: e.target.value})}
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={newUniversity.state}
                  onChange={(e) => setNewUniversity({...newUniversity, state: e.target.value})}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state.id} value={state.name}>{state.name}</option>
                  ))}
                </select>
                <Button onClick={addUniversity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Universities list */}
              <div className="space-y-2">
                {universities.map((university) => (
                  <div key={university.id} className="flex items-center justify-between p-3 border rounded-md">
                    {editingUniversity === university.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={university.name}
                          onChange={(e) => updateUniversity(university.id, { name: e.target.value })}
                        />
                        <select
                          className="px-3 py-2 border rounded-md"
                          value={university.state}
                          onChange={(e) => updateUniversity(university.id, { state: e.target.value })}
                        >
                          {states.map(state => (
                            <option key={state.id} value={state.name}>{state.name}</option>
                          ))}
                        </select>
                        <Button size="sm" onClick={() => setEditingUniversity(null)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-medium">{university.name}</p>
                          <p className="text-sm text-gray-500">{university.state}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingUniversity(university.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteUniversity(university.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states">
          <Card>
            <CardHeader>
              <CardTitle>States</CardTitle>
              <CardDescription>Manage the list of states available for booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new state */}
              <div className="flex gap-2">
                <Input
                  placeholder="State name"
                  value={newState.name}
                  onChange={(e) => setNewState({name: e.target.value})}
                />
                <Button onClick={addState}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* States list */}
              <div className="space-y-2">
                {states.map((state) => (
                  <div key={state.id} className="flex items-center justify-between p-3 border rounded-md">
                    {editingState === state.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={state.name}
                          onChange={(e) => updateState(state.id, { name: e.target.value })}
                        />
                        <Button size="sm" onClick={() => setEditingState(null)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium">{state.name}</p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingState(state.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteState(state.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Rules</CardTitle>
              <CardDescription>Set base prices and vehicle multipliers for different routes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new pricing rule */}
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                <div>
                  <Label>From Type</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={newPricingRule.fromType}
                    onChange={(e) => setNewPricingRule({
                      ...newPricingRule, 
                      fromType: e.target.value as 'university' | 'state'
                    })}
                  >
                    <option value="university">University</option>
                    <option value="state">State</option>
                  </select>
                </div>
                <div>
                  <Label>To Type</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={newPricingRule.toType}
                    onChange={(e) => setNewPricingRule({
                      ...newPricingRule, 
                      toType: e.target.value as 'university' | 'state'
                    })}
                  >
                    <option value="university">University</option>
                    <option value="state">State</option>
                  </select>
                </div>
                <div>
                  <Label>From Location</Label>
                  <Input
                    placeholder="From location"
                    value={newPricingRule.fromLocation}
                    onChange={(e) => setNewPricingRule({
                      ...newPricingRule, 
                      fromLocation: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>To Location</Label>
                  <Input
                    placeholder="To location"
                    value={newPricingRule.toLocation}
                    onChange={(e) => setNewPricingRule({
                      ...newPricingRule, 
                      toLocation: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Base Price (₦)</Label>
                  <Input
                    type="number"
                    placeholder="Base price"
                    value={newPricingRule.basePrice}
                    onChange={(e) => setNewPricingRule({
                      ...newPricingRule, 
                      basePrice: Number(e.target.value)
                    })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addPricingRule} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pricing Rule
                  </Button>
                </div>
              </div>

              {/* Pricing rules list */}
              <div className="space-y-2">
                {pricingRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {rule.fromLocation} → {rule.toLocation}
                        </p>
                        <p className="text-sm text-gray-500">
                          Base Price: ₦{rule.basePrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deletePricingRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>Corolla: ×{rule.vehicleMultipliers.corolla}</div>
                      <div>Sienna: ×{rule.vehicleMultipliers.sienna}</div>
                      <div>Hiace: ×{rule.vehicleMultipliers.hiace}</div>
                      <div>Long Bus: ×{rule.vehicleMultipliers.longBus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationManagement;
