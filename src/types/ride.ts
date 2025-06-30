// src/types/ride.ts

export interface Ride {
  id: string;
  from_location: string;
  to_location: string;
  departure_date: string;
  departure_time: string;
  status: string;
  user_id?: string;
  booking_type?: string;
  price?: number;
  seats_requested?: number;
  vehicle_id?: string;
  // Add more fields as needed, but avoid using 'any'.
}
