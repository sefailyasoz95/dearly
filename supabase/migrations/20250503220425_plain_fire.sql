/*
  # Update user signup triggers

  1. Changes
    - Update handle_new_user function to include first_name and last_name
    - Update handle_new_profile function to use last_name for family_name
    - Add NOT NULL constraints to first_name and last_name in profiles table

  2. Security
    - Maintain existing RLS policies
*/

-- Update profiles table to make first_name and last_name required
ALTER TABLE public.profiles
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- Update function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  
  RETURN new;
END;
$$;

-- Update function to handle new profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  family_id uuid;
BEGIN
  -- Create a new family using the user's last name
  INSERT INTO public.families (family_name)
  VALUES (NEW.last_name)
  RETURNING id INTO family_id;
  
  -- Update the profile with the new family_id
  UPDATE public.profiles
  SET family_id = family_id
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;