-- Change the default value for is_public_profile to false (private by default)
ALTER TABLE public.profiles ALTER COLUMN is_public_profile SET DEFAULT false;