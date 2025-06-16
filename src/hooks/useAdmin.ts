
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdmin = () => {
  const queryClient = useQueryClient();

  // Fetch all rides with user profiles
  const { data: rides } = useQuery({
    queryKey: ['admin-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          profiles!rides_user_id_fkey(full_name, email),
          driver_profiles!rides_driver_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all ride requests with details
  const { data: rideRequests } = useQuery({
    queryKey: ['admin-ride-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ride_requests')
        .select(`
          *,
          rides(from_location, to_location, departure_date, departure_time),
          profiles!ride_requests_requested_by_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all driver profiles
  const { data: driverProfiles } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all user profiles
  const { data: userProfiles } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Approve ride request
  const approveRideRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('ride_requests')
        .update({ 
          status: 'approved',
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ride-requests'] });
      toast.success('Ride request approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve ride request');
      console.error('Error approving ride request:', error);
    },
  });

  // Reject ride request
  const rejectRideRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('ride_requests')
        .update({ 
          status: 'rejected',
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ride-requests'] });
      toast.success('Ride request rejected');
    },
    onError: (error) => {
      toast.error('Failed to reject ride request');
      console.error('Error rejecting ride request:', error);
    },
  });

  // Verify driver
  const verifyDriver = useMutation({
    mutationFn: async (driverId: string) => {
      const { error } = await supabase
        .from('driver_profiles')
        .update({ 
          verification_status: 'verified',
          verification_approved_at: new Date().toISOString()
        })
        .eq('id', driverId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast.success('Driver verified successfully');
    },
    onError: (error) => {
      toast.error('Failed to verify driver');
      console.error('Error verifying driver:', error);
    },
  });

  // Reject driver
  const rejectDriver = useMutation({
    mutationFn: async (driverId: string) => {
      const { error } = await supabase
        .from('driver_profiles')
        .update({ 
          verification_status: 'rejected',
          verification_notes: 'Application rejected by admin'
        })
        .eq('id', driverId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast.success('Driver application rejected');
    },
    onError: (error) => {
      toast.error('Failed to reject driver');
      console.error('Error rejecting driver:', error);
    },
  });

  return {
    rides,
    rideRequests,
    driverProfiles,
    userProfiles,
    approveRideRequest: approveRideRequest.mutate,
    rejectRideRequest: rejectRideRequest.mutate,
    verifyDriver: verifyDriver.mutate,
    rejectDriver: rejectDriver.mutate,
  };
};
