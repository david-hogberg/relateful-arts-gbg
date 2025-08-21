-- Add foreign key constraint to connect facilitator_applications to profiles
ALTER TABLE public.facilitator_applications 
ADD CONSTRAINT fk_facilitator_applications_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance on joins
CREATE INDEX IF NOT EXISTS idx_facilitator_applications_user_id 
ON public.facilitator_applications(user_id);