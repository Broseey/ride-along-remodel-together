
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
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create a new booking
  const createBooking = useMutation({
    mutationFn: async ({ rideId, seatsBooked, totalAmount }: {
      rideId: string;
      seatsBooked: number;
      totalAmount: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check if ride has enough available seats
      const { data: ride } = await supabase
        .from('rides')
        .select('available_seats')
        .eq('id', rideId)
        .single();

      if (!ride || ride.available_seats < seatsBooked) {
        throw new Error('Not enough seats available');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ride_id: rideId,
          user_id: user.id,
          seats_booked: seatsBooked,
          total_amount: totalAmount,
          booking_status: 'confirmed',
          payment_status: 'paid'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-rides'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast.success('Booking confirmed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });

  return {
    userBookings,
    isLoadingBookings,
    createBooking,
  };
};
