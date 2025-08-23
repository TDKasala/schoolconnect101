-- Script to make a user a platform admin
-- Replace 'your-email@example.com' with your actual email address

DO $$
DECLARE
  user_email TEXT := 'denis.mukeba@gmail.com'; -- Change this to your email
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE NOTICE 'User with email % not found in auth.users', user_email;
    RETURN;
  END IF;
  
  -- Update the user's metadata to set role as platform_admin
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "platform_admin"}'::jsonb
  WHERE id = user_id;
  
  -- Update or insert the user profile in the users table
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    approved,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_email,
    'Platform Administrator',
    'platform_admin',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'platform_admin',
    approved = true,
    updated_at = NOW();
    
  RAISE NOTICE 'Successfully made user % a platform admin', user_email;
END $$;
