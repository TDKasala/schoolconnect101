-- Fix infinite recursion in users table RLS policies
-- The issue is that policies are querying the same table they're protecting

begin;

-- Drop existing problematic policies
drop policy if exists "Users can select their own profile" on public.users;
drop policy if exists "Platform admins can select all users" on public.users;
drop policy if exists "Platform admins can update users" on public.users;
drop policy if exists "Platform admins can insert users" on public.users;

-- Create non-recursive policies using auth.jwt() claims instead of table lookups
-- Policy 1: Users can select their own profile
create policy "Users can select their own profile"
  on public.users for select
  to authenticated
  using (id = auth.uid());

-- Policy 2: Platform admins can select all users (using JWT claims)
create policy "Platform admins can select all users"
  on public.users for select
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'platform_admin'
    OR 
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'platform_admin'
  );

-- Policy 3: Platform admins can update users (using JWT claims)
create policy "Platform admins can update users"
  on public.users for update
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'platform_admin'
    OR 
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'platform_admin'
  )
  with check (
    auth.jwt() ->> 'role' = 'platform_admin'
    OR 
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'platform_admin'
  );

-- Policy 4: Platform admins can insert users (using JWT claims)
create policy "Platform admins can insert users"
  on public.users for insert
  to authenticated
  with check (
    auth.jwt() ->> 'role' = 'platform_admin'
    OR 
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'platform_admin'
  );

commit;
