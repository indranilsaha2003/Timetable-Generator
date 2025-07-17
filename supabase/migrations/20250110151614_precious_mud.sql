/*
  # Timetable Generator Schema

  1. New Tables
    - `institute_timings`
      - `id` (uuid, primary key)
      - `start_time` (time)
      - `end_time` (time)
      - `break_start` (time)
      - `break_end` (time)
      - `user_id` (uuid, references auth.users)
      
    - `faculties`
      - `id` (uuid, primary key)
      - `name` (text)
      - `subject_taught` (text)
      - `user_id` (uuid, references auth.users)
      
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `classes_per_week` (integer)
      - `subject_code` (text)
      - `user_id` (uuid, references auth.users)
      
    - `rooms`
      - `id` (uuid, primary key)
      - `room_number` (text)
      - `user_id` (uuid, references auth.users)
      
    - `timetables`
      - `id` (uuid, primary key)
      - `schedule` (jsonb)
      - `user_id` (uuid, references auth.users)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Institute Timings Table
CREATE TABLE institute_timings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_start time NOT NULL,
  break_end time NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE institute_timings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own institute timings"
  ON institute_timings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Faculties Table
CREATE TABLE faculties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject_taught text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own faculties"
  ON faculties
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Subjects Table
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  classes_per_week integer NOT NULL,
  subject_code text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Rooms Table
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own rooms"
  ON rooms
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Timetables Table
CREATE TABLE timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule jsonb NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own timetables"
  ON timetables
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);