-- Add DELETE policies for resources and venues tables

-- Allow authors and admins to delete resources
CREATE POLICY "Authors and admins can delete resources" 
ON public.resources 
FOR DELETE 
USING ((author_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::user_role)))));

-- Allow authors and admins to delete venues
CREATE POLICY "Authors and admins can delete venues" 
ON public.venues 
FOR DELETE 
USING ((author_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::user_role)))));