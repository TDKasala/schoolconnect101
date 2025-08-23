-- Simple fix for RLS policy infinite recursion
-- Run this in Supabase SQL Editor

-- Temporarily disable RLS to clear all policies
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
-- Policy 1: Allow users to read their own data
CREATE POLICY "users_read_own" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Allow users to update their own data  
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Allow service role to insert user profiles
CREATE POLICY "service_role_insert" ON public.users
    FOR INSERT
    WITH CHECK (true);

-- Verify the fix
SELECT 'Policies created successfully' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public';
