-- Create storage buckets for different image types
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-images', 'profile-images', true),
  ('event-images', 'event-images', true),
  ('resource-images', 'resource-images', true),
  ('venue-images', 'venue-images', true)
ON CONFLICT (id) DO NOTHING;

-- Add image_url columns to existing tables
ALTER TABLE public.profiles ADD COLUMN image_url TEXT;
ALTER TABLE public.events ADD COLUMN image_url TEXT;
ALTER TABLE public.resources ADD COLUMN image_url TEXT;
ALTER TABLE public.venues ADD COLUMN image_url TEXT;
ALTER TABLE public.resource_submissions ADD COLUMN image_url TEXT;
ALTER TABLE public.venue_submissions ADD COLUMN image_url TEXT;
ALTER TABLE public.facilitator_applications ADD COLUMN image_url TEXT;

-- Create RLS policies for profile images
CREATE POLICY "Profile images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for event images
CREATE POLICY "Event images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-images');

CREATE POLICY "Facilitators can upload event images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'event-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

CREATE POLICY "Facilitators can update event images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'event-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

CREATE POLICY "Facilitators can delete event images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'event-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

-- Create RLS policies for resource images
CREATE POLICY "Resource images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resource-images');

CREATE POLICY "Facilitators can upload resource images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resource-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

CREATE POLICY "Facilitators can update resource images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resource-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

CREATE POLICY "Facilitators can delete resource images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resource-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

-- Create RLS policies for venue images
CREATE POLICY "Venue images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'venue-images');

CREATE POLICY "Facilitators can upload venue images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'venue-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

CREATE POLICY "Facilitators can update venue images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'venue-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));

CREATE POLICY "Facilitators can delete venue images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'venue-images' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
));