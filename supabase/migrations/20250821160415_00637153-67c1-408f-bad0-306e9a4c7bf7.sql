-- Add facilitator profile fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS public_bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_types TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approach TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public_profile BOOLEAN DEFAULT true;

-- Update the application form to include more fields
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS public_bio TEXT;
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS work_types TEXT[] DEFAULT '{}';
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE public.facilitator_applications ADD COLUMN IF NOT EXISTS approach TEXT;