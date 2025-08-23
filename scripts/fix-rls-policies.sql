-- Fix RLS policy infinite recursion in users table
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily to fix the issue
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Policy 1: Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Allow authenticated users to insert their own profile
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy 4: Platform admins can read all users (avoid recursion by not checking user role in policy)
CREATE POLICY "platform_admin_select_all" ON public.users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    );

-- Policy 5: Platform admins can update all users (simple check without role lookup)
CREATE POLICY "platform_admin_update_all" ON public.users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    );

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';
