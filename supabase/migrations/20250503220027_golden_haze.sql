/*
  # Authentication Triggers

  1. Triggers
    - Create profile after user signs up
    - Create family after profile creation
    
  2. Functions
    - handle_new_user: Creates a profile for new users
    - handle_new_profile: Creates a family for new profiles
    
  3. Security
    - Enable RLS on profiles and families tables
    - Add policies for authenticated users
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  first_name text,
  last_name text,
  email text,
  birth_date date,
  country text,
  city text,
  is_paying boolean DEFAULT false,
  family_id uuid,
  is_active boolean DEFAULT true
);

-- Create families table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  family_name text NOT NULL
);

-- Add foreign key constraint
ALTER TABLE public.profiles
ADD CONSTRAINT fk_family
FOREIGN KEY (family_id) REFERENCES public.families(id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  RETURN new;
END;
$$;

-- Function to handle new profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  family_id uuid;
BEGIN
  -- Create a new family using the user's email as family name
  INSERT INTO public.families (family_name)
  VALUES (NEW.email)
  RETURNING id INTO family_id;
  
  -- Update the profile with the new family_id
  UPDATE public.profiles
  SET family_id = family_id
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Trigger after auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger after profiles insert
CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for families
CREATE POLICY "Users can view own family"
  ON public.families
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT family_id 
      FROM public.profiles 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own family"
  ON public.families
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT family_id 
      FROM public.profiles 
      WHERE profiles.id = auth.uid()
    )
  );