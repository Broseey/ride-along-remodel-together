
-- First, let's check and update the ride_requests table structure to match what the code expects
-- We need to add the missing columns that the code is trying to access

-- Add missing columns to ride_requests table
ALTER TABLE public.ride_requests 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS from_location text,
ADD COLUMN IF NOT EXISTS to_location text,
ADD COLUMN IF NOT EXISTS preferred_date date,
ADD COLUMN IF NOT EXISTS preferred_time time,
ADD COLUMN IF NOT EXISTS seats_needed integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_price numeric,
ADD COLUMN IF NOT EXISTS description text;

-- Update the existing data to use user_id instead of requested_by
UPDATE public.ride_requests 
SET user_id = requested_by 
WHERE user_id IS NULL AND requested_by IS NOT NULL;

-- Enable RLS on ride_requests if not already enabled
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ride_requests
DROP POLICY IF EXISTS "Users can view their own ride requests" ON public.ride_requests;
DROP POLICY IF EXISTS "Users can create ride requests" ON public.ride_requests;

CREATE POLICY "Users can view their own ride requests" 
ON public.ride_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create ride requests" 
ON public.ride_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for rides
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view available rides" ON public.rides;
DROP POLICY IF EXISTS "Users can create rides" ON public.rides;

CREATE POLICY "Anyone can view available rides" 
ON public.rides 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create rides" 
ON public.rides 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
