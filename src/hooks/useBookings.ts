
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

  // Create a new booking - FIXED: Improved error handling and validation
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

      // For now, create a simplified booking entry
      // In a real implementation, this would connect to available rides
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

  return {
    userBookings,
    isLoadingBookings,
    createBooking,
  };
};
