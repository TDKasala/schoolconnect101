-- Fix RLS policies for users table to allow proper admin access
-- This ensures platform admins can read all users for the admin dashboard

begin;

-- Ensure RLS is enabled on users table
alter table if exists public.users enable row level security;

-- Drop existing policies to recreate them properly
drop policy if exists "Users can select their own profile" on public.users;
drop policy if exists "Platform admins can select all users" on public.users;
drop policy if exists "Platform admins can insert users" on public.users;
drop policy if exists "Platform admins can update users" on public.users;

-- Policy 1: Users can select their own profile
create policy "Users can select their own profile"
  on public.users for select
  to authenticated
  using (id = auth.uid());

-- Policy 2: Platform admins can select all users (fixed recursion issue)
create policy "Platform admins can select all users"
  on public.users for select
  to authenticated
  using (
    -- Check if current user is platform admin by looking at user metadata
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'platform_admin'
    OR
    -- Fallback: check if user exists in users table with platform_admin role
    exists (
      select 1 from auth.users au
      where au.id = auth.uid()
      and (au.raw_user_meta_data ->> 'role')::text = 'platform_admin'
    )
  );

-- Policy 3: Platform admins can insert users
create policy "Platform admins can insert users"
  on public.users for insert
  to authenticated
  with check (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'platform_admin'
    OR
    exists (
      select 1 from auth.users au
      where au.id = auth.uid()
      and (au.raw_user_meta_data ->> 'role')::text = 'platform_admin'
    )
  );

-- Policy 4: Platform admins can update users
create policy "Platform admins can update users"
  on public.users for update
  to authenticated
  using (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'platform_admin'
    OR
    exists (
      select 1 from auth.users au
      where au.id = auth.uid()
      and (au.raw_user_meta_data ->> 'role')::text = 'platform_admin'
    )
  );

-- Policy 5: Users can update their own profile
create policy "Users can update their own profile"
  on public.users for update
  to authenticated
  using (id = auth.uid());

commit;
