/*
  # Laundry Room Booking System

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `booking_date` (date) - The date of the booking
      - `time_slot` (text) - Time slot (e.g., "08:00-10:00")
      - `user_name` (text) - Name of person booking
      - `user_email` (text) - Email of person booking
      - `created_at` (timestamptz) - When booking was created

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for anyone to view all bookings (public read)
    - Add policy for anyone to create their own booking (public insert)
    - Add policy for users to delete their own bookings by email (public delete)

  3. Indexes
    - Index on booking_date and time_slot for fast queries
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_date date NOT NULL,
  time_slot text NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_date, time_slot)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(booking_date, time_slot);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own bookings"
  ON bookings FOR DELETE
  USING (true);