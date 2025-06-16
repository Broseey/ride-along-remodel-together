
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAvailableRides = () => {
  const { data: availableRides, isLoading, refetch } = useQuery({
    queryKey: ['available-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          profiles!rides_user_id_fkey(full_name, email)
        `)
        .in('status', ['available', 'confirmed'])
        .gt('available_seats', 0)
        .gte('departure_date', new Date().toISOString().split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  return {
    availableRides,
    isLoading,
    refetch,
  };
};
