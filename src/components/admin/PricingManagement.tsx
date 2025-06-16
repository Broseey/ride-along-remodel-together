
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, DollarSign } from "lucide-react";
import { toast } from "sonner";

// Sample pricing data
const samplePricing = [
  {
    id: 1,
    fromState: "Lagos",
    toUniversity: "University of Ibadan",
    vehicleType: "Toyota Sienna",
    basePrice: 1200,
    isActive: true
  },
  {
    id: 2,
    fromState: "Abuja",
    toUniversity: "Ahmadu Bello University",
    vehicleType: "Toyota Hiace",
    basePrice: 1500,
    isActive: true
  },
  {
    id: 3,
    fromState: "Port Harcourt",
    toUniversity: "University of Port Harcourt",
    vehicleType: "Toyota Corolla",
    basePrice: 800,
    isActive: true
  }
];

const PricingManagement = () => {
  const [pricing, setPricing] = useState(samplePricing);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPricing, setNewPricing] = useState({
    fromState: '',
    toUniversity: '',
    vehicleType: '',
    basePrice: ''
  });

  const states = [
    'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Kaduna',
    'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos', 'Ilorin'
  ];

  const universities = [
    'University of Ibadan', 'Ahmadu Bello University', 'University of Port Harcourt',
    'University of Lagos', 'Obafemi Awolowo University', 'University of Nigeria Nsukka',
    'Bayero University Kano', 'University of Benin', 'Covenant University',
    'Federal University of Technology Akure', 'University of Ilorin'
  ];

  const vehicleTypes = [
    'Toyota Sienna', 'Toyota Hiace', 'Toyota Corolla', 'Honda Pilot',
    'Mercedes Sprinter', 'Nissan Urvan'
  ];

  const handleCreate = () => {
    if (!newPricing.fromState || !newPricing.toUniversity || 
        !newPricing.vehicleType || !newPricing.basePrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const newItem = {
      id: pricing.length + 1,
      fromState: newPricing.fromState,
      toUniversity: newPricing.toUniversity,
      vehicleType: newPricing.vehicleType,
      basePrice: parseFloat(newPricing.basePrice),
      isActive: true
    };

    setPricing([...pricing, newItem]);
    setNewPricing({ fromState: '', toUniversity: '', vehicleType: '', basePrice: '' });
    setIsCreating(false);
    toast.success('Pricing rule created successfully');
  };

  const handleToggleActive = (id: number) => {
    setPricing(pricing.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
    toast.success('Pricing rule updated');
  };

  const handleDelete = (id: number) => {
    setPricing(pricing.filter(item => item.id !== id));
    toast.success('Pricing rule deleted');
  };

  const handlePriceUpdate = (id: number, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setPricing(pricing.map(item => 
      item.id === id ? { ...item, basePrice: price } : item
    ));
    setEditingId(null);
    toast.success('Price updated successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Route Pricing Management</CardTitle>
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
                  <Label>From State</Label>
                  <Select value={newPricing.fromState} onValueChange={(value) => 
                    setNewPricing({...newPricing, fromState: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>To University</Label>
                  <Select value={newPricing.toUniversity} onValueChange={(value) => 
                    setNewPricing({...newPricing, toUniversity: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map(uni => (
                        <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Vehicle Type</Label>
                  <Select value={newPricing.vehicleType} onValueChange={(value) => 
                    setNewPricing({...newPricing, vehicleType: value})
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
                    placeholder="1200"
                    value={newPricing.basePrice}
                    onChange={(e) => setNewPricing({...newPricing, basePrice: e.target.value})}
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
            {pricing.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-medium">{item.fromState}</p>
                    <p className="text-sm text-gray-500">From</p>
                  </div>
                  <div>
                    <p className="font-medium">{item.toUniversity}</p>
                    <p className="text-sm text-gray-500">To</p>
                  </div>
                  <div>
                    <p className="font-medium">{item.vehicleType}</p>
                    <p className="text-sm text-gray-500">Vehicle</p>
                  </div>
                  <div>
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          defaultValue={item.basePrice}
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
                            const input = document.querySelector(`input[defaultValue="${item.basePrice}"]`) as HTMLInputElement;
                            handlePriceUpdate(item.id, input.value);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium">₦{item.basePrice.toLocaleString()}</p>
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
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(item.id)}
                  >
                    {item.isActive ? "Disable" : "Enable"}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingManagement;
