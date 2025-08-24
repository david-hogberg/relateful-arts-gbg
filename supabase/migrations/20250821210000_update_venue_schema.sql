-- Update venue database schema with new fields
-- This migration updates both venues and venue_submissions tables

-- First, update the venues table
ALTER TABLE public.venues 
  DROP COLUMN IF EXISTS location,
  DROP COLUMN IF EXISTS hosting_capacity,
  DROP COLUMN IF EXISTS contact_information,
  DROP COLUMN IF EXISTS cost_level,
  DROP COLUMN IF EXISTS notes;

-- Add new fields to venues table
ALTER TABLE public.venues 
  ADD COLUMN address TEXT NOT NULL,
  ADD COLUMN capacity INTEGER NOT NULL,
  ADD COLUMN contact_email TEXT NOT NULL,
  ADD COLUMN contact_phone TEXT NOT NULL,
  ADD COLUMN category TEXT NOT NULL,
  ADD COLUMN price_information TEXT NOT NULL,
  ADD COLUMN description TEXT NOT NULL,
  ADD COLUMN additional_notes TEXT;

-- Update the venue_submissions table to match
ALTER TABLE public.venue_submissions 
  DROP COLUMN IF EXISTS location,
  DROP COLUMN IF EXISTS hosting_capacity,
  DROP COLUMN IF EXISTS contact_information,
  DROP COLUMN IF EXISTS cost_level,
  DROP COLUMN IF EXISTS notes;

-- Add new fields to venue_submissions table
ALTER TABLE public.venue_submissions 
  ADD COLUMN address TEXT NOT NULL,
  ADD COLUMN capacity INTEGER NOT NULL,
  ADD COLUMN contact_email TEXT NOT NULL,
  ADD COLUMN contact_phone TEXT NOT NULL,
  ADD COLUMN category TEXT NOT NULL,
  ADD COLUMN price_information TEXT NOT NULL,
  ADD COLUMN description TEXT NOT NULL,
  ADD COLUMN additional_notes TEXT;

-- Create indexes for better performance on new fields
CREATE INDEX IF NOT EXISTS idx_venues_category ON public.venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_capacity ON public.venues(capacity);
CREATE INDEX IF NOT EXISTS idx_venue_submissions_category ON public.venue_submissions(category);
CREATE INDEX IF NOT EXISTS idx_venue_submissions_capacity ON public.venue_submissions(capacity);

-- Add constraints for data validation
ALTER TABLE public.venues 
  ADD CONSTRAINT venues_capacity_positive CHECK (capacity > 0),
  ADD CONSTRAINT venues_contact_email_valid CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.venue_submissions 
  ADD CONSTRAINT venue_submissions_capacity_positive CHECK (capacity > 0),
  ADD CONSTRAINT venue_submissions_contact_email_valid CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Update any existing data to have default values for required fields
-- This ensures the migration doesn't fail on existing data
UPDATE public.venues SET 
  address = COALESCE(address, 'Address not specified'),
  capacity = COALESCE(capacity, 1),
  contact_email = COALESCE(contact_email, 'contact@venue.com'),
  contact_phone = COALESCE(contact_phone, 'Phone not specified'),
  category = COALESCE(category, 'General'),
  price_information = COALESCE(price_information, 'Contact for pricing'),
  description = COALESCE(description, 'No description available')
WHERE address IS NULL OR capacity IS NULL OR contact_email IS NULL OR 
      contact_phone IS NULL OR category IS NULL OR price_information IS NULL OR 
      description IS NULL;

UPDATE public.venue_submissions SET 
  address = COALESCE(address, 'Address not specified'),
  capacity = COALESCE(capacity, 1),
  contact_email = COALESCE(contact_email, 'contact@venue.com'),
  contact_phone = COALESCE(contact_phone, 'Phone not specified'),
  category = COALESCE(category, 'General'),
  price_information = COALESCE(price_information, 'Contact for pricing'),
  description = COALESCE(description, 'No description available')
WHERE address IS NULL OR capacity IS NULL OR contact_email IS NULL OR 
      contact_phone IS NULL OR category IS NULL OR price_information IS NULL OR 
      description IS NULL;
