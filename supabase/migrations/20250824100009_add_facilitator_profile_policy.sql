-- Allow public access to facilitator profiles
CREATE POLICY "Public can view facilitator profiles"
ON public.profiles FOR SELECT
TO anon
USING (
  role IN ('facilitator', 'admin') AND is_public_profile = true
);
