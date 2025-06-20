
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAvailableRides = () => {
  const { data: availableRides, isLoading, refetch } = useQuery({
    queryKey: ['available-rides'],
    queryFn: async () => {
      console.log('Fetching available rides...');
      
      // First, get the rides
      const { data: ridesData, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .in('status', ['available', 'confirmed'])
        .gt('available_seats', 0)
        .gte('departure_date', new Date().toISOString().split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (ridesError) {
        console.error('Error fetching rides:', ridesError);
        return [];
      }

      if (!ridesData || ridesData.length === 0) {
        console.log('No rides found');
        return [];
      }

      // Get unique user IDs from the rides
      const userIds = [...new Set(ridesData.map(ride => ride.user_id))];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profile data if profiles fetch fails
      }

      // Create a map of user profiles for easy lookup
      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Combine rides with profile data
      const ridesWithProfiles = ridesData.map(ride => ({
        ...ride,
        profiles: profilesMap.get(ride.user_id) || {
          full_name: 'Unknown User',
          email: 'No email'
        }
      }));

      console.log('Successfully fetched rides with profiles:', ridesWithProfiles.length);
      return ridesWithProfiles;
    },
  });

  return {
    availableRides,
    isLoading,
    refetch,
  };
};
