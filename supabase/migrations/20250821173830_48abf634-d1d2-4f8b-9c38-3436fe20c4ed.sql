-- Create resources table for approved/published resources
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'link')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT, -- For markdown content (nullable for links)
  url TEXT, -- For external links (nullable for articles)
  tags TEXT[] NOT NULL DEFAULT '{}',
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resource submissions table for pending approval
CREATE TABLE public.resource_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'link')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT, -- For markdown content
  url TEXT, -- For external links
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for resources (public read)
CREATE POLICY "Anyone can view published resources"
ON public.resources
FOR SELECT
USING (true);

-- Only admins and facilitators can insert resources directly
CREATE POLICY "Facilitators and admins can create resources"
ON public.resources
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND (role = 'facilitator' OR role = 'admin')
  )
);

-- Authors and admins can update their resources
CREATE POLICY "Authors and admins can update resources"
ON public.resources
FOR UPDATE
USING (
  author_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS policies for resource submissions
CREATE POLICY "Users can create own submissions"
ON public.resource_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions and admins can view all"
ON public.resource_submissions
FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update submissions"
ON public.resource_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add updated_at trigger for both tables
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_submissions_updated_at
  BEFORE UPDATE ON public.resource_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();