-- Quick fix for users table RLS - run this in Supabase SQL Editor

-- Temporarily disable RLS to allow admin access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable with proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can select their own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can select all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update users" ON public.users;

-- Allow all authenticated users to read users table (temporary broad access)
CREATE POLICY "Allow authenticated users to read users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert users
CREATE POLICY "Allow authenticated users to insert users"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update users
CREATE POLICY "Allow authenticated users to update users"
  ON public.users FOR UPDATE
  TO authenticated
  USING (true);
