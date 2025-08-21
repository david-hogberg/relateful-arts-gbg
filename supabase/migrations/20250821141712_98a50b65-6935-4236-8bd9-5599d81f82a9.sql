-- Fix security definer functions by setting search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS public.user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;