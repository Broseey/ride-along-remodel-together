
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRideRequests } from '@/hooks/useRideRequests';

const formSchema = z.object({
  from_location: z.string().min(1, 'From location is required'),
  to_location: z.string().min(1, 'To location is required'),
  preferred_date: z.string().min(1, 'Preferred date is required'),
  preferred_time: z.string().min(1, 'Preferred time is required'),
  seats_needed: z.number().min(1, 'At least 1 seat is required').max(6, 'Maximum 6 seats'),
  max_price: z.number().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const RideRequestForm = () => {
  const { createRideRequest } = useRideRequests();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seats_needed: 1,
    }
  });

  const onSubmit = async (data: FormData) => {
    createRideRequest.mutate(data, {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarPlus className="h-5 w-5" />
          Request a Ride
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_location">From</Label>
              <Input
                id="from_location"
                {...register('from_location')}
                placeholder="e.g., Lagos"
              />
              {errors.from_location && (
                <p className="text-sm text-red-600">{errors.from_location.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="to_location">To</Label>
              <Input
                id="to_location"
                {...register('to_location')}
                placeholder="e.g., University of Ibadan"
              />
              {errors.to_location && (
                <p className="text-sm text-red-600">{errors.to_location.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferred_date">Preferred Date</Label>
              <Input
                id="preferred_date"
                type="date"
                {...register('preferred_date')}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.preferred_date && (
                <p className="text-sm text-red-600">{errors.preferred_date.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="preferred_time">Preferred Time</Label>
              <Input
                id="preferred_time"
                type="time"
                {...register('preferred_time')}
              />
              {errors.preferred_time && (
                <p className="text-sm text-red-600">{errors.preferred_time.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seats_needed">Seats Needed</Label>
              <Input
                id="seats_needed"
                type="number"
                min="1"
                max="6"
                {...register('seats_needed', { valueAsNumber: true })}
              />
              {errors.seats_needed && (
                <p className="text-sm text-red-600">{errors.seats_needed.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="max_price">Maximum Price (₦)</Label>
              <Input
                id="max_price"
                type="number"
                {...register('max_price', { valueAsNumber: true })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Any specific requirements or details..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RideRequestForm;
