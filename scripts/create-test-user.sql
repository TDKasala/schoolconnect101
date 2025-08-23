-- Create test user for authentication testing
-- Run this in Supabase SQL Editor

-- First, run the RLS policy fix to prevent recursion
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to prevent conflicts
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.users';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create minimal, safe policies without recursion
CREATE POLICY "users_read_own" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "service_role_insert" ON public.users
    FOR INSERT
    WITH CHECK (true);

-- Check if test user exists in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'test@schoolconnect.com';

-- Insert test user profile (this will work after you create the auth user)
-- You'll need to replace 'USER_ID_HERE' with the actual UUID from auth.users
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  school_id,
  approved,
  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE', -- Replace with actual UUID from auth.users
  'test@schoolconnect.com',
  'Test Admin User',
  'platform_admin',
  NULL,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) 
DO UPDATE SET 
  full_name = 'Test Admin User',
  role = 'platform_admin',
  approved = true,
  updated_at = NOW();

-- Verify the user profile was created
SELECT id, email, full_name, role, approved FROM public.users WHERE email = 'test@schoolconnect.com';
