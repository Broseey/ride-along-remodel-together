
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

      console.log('Fetching user bookings for user:', user.id);

      // First get the bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      if (!bookingsData || bookingsData.length === 0) {
        return [];
      }

      // Get the ride IDs from bookings
      const rideIds = bookingsData.map(booking => booking.ride_id);

      // Fetch the associated rides
      const { data: ridesData, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .in('id', rideIds);

      if (ridesError) {
        console.error('Error fetching rides for bookings:', ridesError);
        throw ridesError;
      }

      // Create a map of rides for easy lookup
      const ridesMap = new Map();
      if (ridesData) {
        ridesData.forEach(ride => {
          ridesMap.set(ride.id, ride);
        });
      }

      // Combine bookings with ride data
      const bookingsWithRides = bookingsData.map(booking => ({
        ...booking,
        rides: ridesMap.get(booking.ride_id)
      }));

      return bookingsWithRides;
    },
  });

  // Create a new booking
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

      // Validate that the ride ID is a proper UUID
      if (!rideId || rideId === 'temp-ride-id' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rideId)) {
        throw new Error('Invalid ride selected. Please select a valid ride.');
      }

      // Check if ride exists and has enough available seats
      const { data: ride, error: rideError } = await supabase
        .from('rides')
        .select('available_seats, total_seats, price, status')
        .eq('id', rideId)
        .single();

      if (rideError) {
        console.error('Error fetching ride:', rideError);
        throw new Error('Ride not found or no longer available');
      }

      if (!ride) {
        throw new Error('Ride not found');
      }

      if (ride.status !== 'available' && ride.status !== 'confirmed') {
        throw new Error('This ride is no longer available for booking');
      }

      if (ride.available_seats < seatsBooked) {
        throw new Error(`Only ${ride.available_seats} seats available. You requested ${seatsBooked} seats.`);
      }

      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ride_id: rideId,
          user_id: user.id,
          seats_booked: seatsBooked,
          total_amount: totalAmount,
          booking_status: 'confirmed',
          payment_status: paymentReference ? 'paid' : 'pending',
          payment_reference: paymentReference
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating booking:', error);
        throw new Error(`Failed to create booking: ${error.message}`);
      }

      console.log('Booking created successfully:', data);

      // Update the ride's available seats
      const { error: updateError } = await supabase
        .from('rides')
        .update({ 
          available_seats: ride.available_seats - seatsBooked,
          status: ride.available_seats - seatsBooked === 0 ? 'confirmed' : 'available'
        })
        .eq('id', rideId);

      if (updateError) {
        console.error('Error updating ride seats:', updateError);
        // Don't throw here as the booking was successful
      }

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
      toast.error(error.message || 'Failed to create booking');
    },
  });

  return {
    userBookings,
    isLoadingBookings,
    createBooking,
  };
};
