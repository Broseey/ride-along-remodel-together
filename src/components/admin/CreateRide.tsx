
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  from_location: z.string().min(1, 'From location is required'),
  to_location: z.string().min(1, 'To location is required'),
  departure_date: z.string().min(1, 'Departure date is required'),
  departure_time: z.string().min(1, 'Departure time is required'),
  total_seats: z.number().min(1, 'At least 1 seat is required').max(50, 'Maximum 50 seats'),
  price: z.number().min(1, 'Price must be greater than 0'),
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
  pickup_location: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateRide = () => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_seats: 6,
      price: 0,
    }
  });

  // Updated Nigerian states and universities with major universities
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
    'Federal University, Birnin Kebbi (FUBK)',
    'Bowen University',
    'Redeemer\'s University',
    'Lead City University',
    'Bells University of Technology',
    'Crawford University',
    'Landmark University',
    'Mountain Top University',
    'Pan-Atlantic University',
    'American University of Nigeria (AUN)',
    'Igbinedion University'
  ];

  const createRide = useMutation({
    mutationFn: async (data: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: rideData, error } = await supabase
        .from('rides')
        .insert({
          from_location: data.from_location,
          to_location: data.to_location,
          departure_date: data.departure_date,
          departure_time: data.departure_time,
          total_seats: data.total_seats,
          available_seats: data.total_seats,
          price: data.price,
          vehicle_type: data.vehicle_type,
          pickup_location: data.pickup_location,
          description: data.description,
          user_id: user.id,
          booking_type: 'admin_created',
          status: 'available',
          seats_requested: 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return rideData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rides'] });
      queryClient.invalidateQueries({ queryKey: ['available-rides'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Ride created successfully! Users can now book seats.');
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create ride');
    },
  });

  const onSubmit = async (data: FormData) => {
    createRide.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Create New Ride
        </CardTitle>
        <p className="text-sm text-gray-600">
          Create rides that will appear in "Available Rides" for users to book seats
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_location">From Location</Label>
              <Select onValueChange={(value) => setValue('from_location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select departure location" />
                </SelectTrigger>
                <SelectContent>
                  <div className="font-semibold px-2 py-1 text-sm">States</div>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                  <div className="font-semibold px-2 py-1 text-sm border-t mt-2 pt-2">Universities</div>
                  {nigerianUniversities.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.from_location && (
                <p className="text-sm text-red-600">{errors.from_location.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="to_location">To Location</Label>
              <Select onValueChange={(value) => setValue('to_location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <div className="font-semibold px-2 py-1 text-sm">States</div>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                  <div className="font-semibold px-2 py-1 text-sm border-t mt-2 pt-2">Universities</div>
                  {nigerianUniversities.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.to_location && (
                <p className="text-sm text-red-600">{errors.to_location.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departure_date">Departure Date</Label>
              <Input
                id="departure_date"
                type="date"
                {...register('departure_date')}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.departure_date && (
                <p className="text-sm text-red-600">{errors.departure_date.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="departure_time">Departure Time</Label>
              <Input
                id="departure_time"
                type="time"
                {...register('departure_time')}
              />
              {errors.departure_time && (
                <p className="text-sm text-red-600">{errors.departure_time.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_seats">Total Seats</Label>
              <Input
                id="total_seats"
                type="number"
                min="1"
                max="50"
                {...register('total_seats', { valueAsNumber: true })}
              />
              {errors.total_seats && (
                <p className="text-sm text-red-600">{errors.total_seats.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="price">Price per Seat (₦)</Label>
              <Input
                id="price"
                type="number"
                min="1"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              <Select onValueChange={(value) => setValue('vehicle_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Coaster">Coaster</SelectItem>
                  <SelectItem value="Sprinter">Sprinter</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicle_type && (
                <p className="text-sm text-red-600">{errors.vehicle_type.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="pickup_location">Pickup Location (Optional)</Label>
            <Input
              id="pickup_location"
              {...register('pickup_location')}
              placeholder="e.g., University Main Gate, Central Bus Station, Lagos Island"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Additional details about the ride (e.g., stops, amenities, contact info)..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Ride...' : 'Create Ride for Users to Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRide;
