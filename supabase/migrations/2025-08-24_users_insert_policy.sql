-- Allow platform admins to insert new users
-- This is needed for the admin user management functionality

begin;

-- Ensure RLS is enabled (no-op if already enabled)
alter table if exists public.users enable row level security;

-- Policy: platform admins can insert users
drop policy if exists "Platform admins can insert users" on public.users;
create policy "Platform admins can insert users"
  on public.users for insert
  to authenticated
  with check (
    (auth.jwt() ->> 'role')::text = 'platform_admin'
  );

commit;
