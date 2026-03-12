/*
  # Meal Registration System

  1. New Tables
    - `meal_registrations`
      - `id` (uuid, primary key)
      - `name` (text) - Name of person registering meal
      - `meal_count` (integer) - Number of meals
      - `registration_date` (date) - Date of registration
      - `created_at` (timestamptz) - When registration was created

  2. Security
    - Enable RLS on `meal_registrations` table
    - Add policy for anyone to view all registrations (public read)
    - Add policy for anyone to create registrations (public insert)
    - Add policy for anyone to delete registrations (public delete)

  3. Indexes
    - Index on registration_date for fast queries
*/

CREATE TABLE IF NOT EXISTS meal_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  meal_count integer NOT NULL DEFAULT 1,
  registration_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meal_registrations_date ON meal_registrations(registration_date);

ALTER TABLE meal_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meal registrations"
  ON meal_registrations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create meal registrations"
  ON meal_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete meal registrations"
  ON meal_registrations FOR DELETE
  USING (true);