
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Fetch user's bookings
  const { data: userBookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rides!inner(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      return data || [];
    },
  });

  // Create a new booking for an existing ride
  const createBooking = useMutation({
    mutationFn: async ({ rideId, seatsBooked, totalAmount, paymentReference }: {
      rideId: string;
      seatsBooked: number;
      totalAmount: number;
      paymentReference?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found - please log in');

      console.log('Creating booking for user:', user.id);
      console.log('Booking details:', { rideId, seatsBooked, totalAmount, paymentReference });

      // Verify the ride exists and has enough seats
      const { data: ride, error: rideError } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .eq('status', 'available')
        .single();

      if (rideError || !ride) {
        throw new Error('Ride not found or no longer available');
      }

      if (ride.available_seats < seatsBooked) {
        throw new Error('Not enough seats available');
      }

      const bookingData = {
        ride_id: rideId,
        user_id: user.id,
        seats_booked: seatsBooked,
        total_amount: totalAmount,
        booking_status: 'confirmed',
        payment_status: paymentReference ? 'paid' : 'pending',
        payment_reference: paymentReference
      };

      console.log('Inserting booking data:', bookingData);

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select(`
          *,
          rides(*)
        `)
        .single();
      
      if (error) {
        console.error('Error creating booking:', error);
        throw new Error(`Failed to create booking: ${error.message}`);
      }

      console.log('Booking created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-rides'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast.success('Booking confirmed successfully!');
    },
    onError: (error: any) => {
      console.error('Booking mutation error:', error);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    },
  });

  // Create a new ride request (for when no existing rides match)
  const createRideRequest = useMutation({
    mutationFn: async ({ 
      fromLocation, 
      toLocation, 
      departureDate, 
      departureTime, 
      seatsNeeded, 
      bookingType 
    }: {
      fromLocation: string;
      toLocation: string;
      departureDate: string;
      departureTime: string;
      seatsNeeded: number;
      bookingType: 'seat_booking' | 'full_ride';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found - please log in');

      const rideData = {
        from_location: fromLocation,
        to_location: toLocation,
        departure_date: departureDate,
        departure_time: departureTime,
        seats_requested: seatsNeeded,
        booking_type: bookingType,
        user_id: user.id,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('rides')
        .insert(rideData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating ride request:', error);
        throw new Error(`Failed to create ride request: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast.success('Ride request submitted successfully! We\'ll notify you when a match is found.');
    },
    onError: (error: any) => {
      console.error('Ride request error:', error);
      toast.error(error.message || 'Failed to create ride request. Please try again.');
    },
  });

  return {
    userBookings,
    isLoadingBookings,
    createBooking,
    createRideRequest,
  };
};
