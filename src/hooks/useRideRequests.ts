
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRideRequests = () => {
  const queryClient = useQueryClient();

  // Fetch user's ride requests
  const { data: userRideRequests, isLoading } = useQuery({
    queryKey: ['user-ride-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create a new ride request
  const createRideRequest = useMutation({
    mutationFn: async (requestData: {
      from_location: string;
      to_location: string;
      preferred_date: string;
      preferred_time: string;
      seats_needed: number;
      max_price?: number;
      description?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('ride_requests')
        .insert({
          ...requestData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-ride-requests'] });
      toast.success('Ride request submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit ride request');
    },
  });

  return {
    userRideRequests,
    isLoading,
    createRideRequest,
  };
};
