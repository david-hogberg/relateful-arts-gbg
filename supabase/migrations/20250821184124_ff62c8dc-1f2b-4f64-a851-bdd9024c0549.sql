-- Add foreign key constraint to resource_submissions table
ALTER TABLE public.resource_submissions 
ADD CONSTRAINT resource_submissions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);