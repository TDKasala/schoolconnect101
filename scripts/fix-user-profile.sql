-- SQL script to fix user profile for Denis in Supabase
-- Run this in Supabase SQL Editor

-- Check if user exists in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'deniskasala17@gmail.com';

-- Insert or update user profile in public.users table
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  school_id,
  approved,
  created_at,
  updated_at
)
SELECT 
  au.id,
  'deniskasala17@gmail.com',
  'Denis Kasala',
  'platform_admin',
  NULL,
  true,
  NOW(),
  NOW()
FROM auth.users au 
WHERE au.email = 'deniskasala17@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  full_name = 'Denis Kasala',
  role = 'platform_admin',
  approved = true,
  updated_at = NOW();

-- Verify the user profile was created/updated
SELECT * FROM public.users WHERE email = 'deniskasala17@gmail.com';
