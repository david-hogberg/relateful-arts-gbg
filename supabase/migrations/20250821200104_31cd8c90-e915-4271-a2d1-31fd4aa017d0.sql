-- Create venue_submissions table for user submissions that need approval
CREATE TABLE public.venue_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  hosting_capacity INTEGER NOT NULL,
  contact_information TEXT NOT NULL,
  cost_level TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venues table for approved venues
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  hosting_capacity INTEGER NOT NULL,
  contact_information TEXT NOT NULL,
  cost_level TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.venue_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Venue submissions policies
CREATE POLICY "Users can create own submissions" 
ON public.venue_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions and admins can view all" 
ON public.venue_submissions 
FOR SELECT 
USING (
  (user_id = auth.uid()) OR 
  (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Admins can update submissions" 
ON public.venue_submissions 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Venues policies
CREATE POLICY "Anyone can view published venues" 
ON public.venues 
FOR SELECT 
USING (true);

CREATE POLICY "Facilitators and admins can create venues" 
ON public.venues 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND (role = 'facilitator' OR role = 'admin'))
);

CREATE POLICY "Authors and admins can update venues" 
ON public.venues 
FOR UPDATE 
USING (
  (author_id = auth.uid()) OR 
  (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_venue_submissions_updated_at
BEFORE UPDATE ON public.venue_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();