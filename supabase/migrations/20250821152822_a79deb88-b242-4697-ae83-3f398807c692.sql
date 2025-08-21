-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  facilitator_id UUID NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('workshop', 'group_session', 'retreat')),
  max_participants INTEGER NOT NULL DEFAULT 20,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(event_id, user_id)
);

-- Enable RLS on both tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for events table
CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Facilitators can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (
  EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'facilitator' OR role = 'admin')
  )
);

CREATE POLICY "Facilitators can update their own events" 
ON public.events 
FOR UPDATE 
USING (
  facilitator_id = auth.uid() OR 
  EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Facilitators can delete their own events" 
ON public.events 
FOR DELETE 
USING (
  facilitator_id = auth.uid() OR 
  EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- RLS policies for event registrations table
CREATE POLICY "Users can view their own registrations and event facilitators can view registrations for their events" 
ON public.event_registrations 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  EXISTS(
    SELECT 1 FROM public.events 
    WHERE events.id = event_registrations.event_id 
    AND events.facilitator_id = auth.uid()
  ) OR
  EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Authenticated users can register for events" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  cancelled_at IS NULL
);

CREATE POLICY "Users can cancel their own registrations" 
ON public.event_registrations 
FOR UPDATE 
USING (user_id = auth.uid());

-- Add foreign key constraint for facilitator_id
ALTER TABLE public.events 
ADD CONSTRAINT events_facilitator_id_fkey 
FOREIGN KEY (facilitator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_events_facilitator_id ON public.events(facilitator_id);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();