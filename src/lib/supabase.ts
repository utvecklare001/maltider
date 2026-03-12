import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Booking {
  id: string;
  booking_date: string;
  time_slot: string;
  user_name: string;
  user_email: string;
  created_at: string;
}
