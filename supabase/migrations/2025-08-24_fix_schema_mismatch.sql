-- Fix schema mismatch between existing database and new code expectations
-- This migration aligns the database schema with the new User & School Management system

begin;

-- Check if schools table exists and what columns it has
-- If it exists but is missing columns, add them
do $$
declare
  table_exists boolean;
begin
  -- Check if schools table exists
  select exists (
    select from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'schools'
  ) into table_exists;
  
  if table_exists then
    -- Add missing columns if they don't exist
    
    -- Make code column nullable if it exists and is NOT NULL
    if exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'code' and is_nullable = 'NO'
    ) then
      alter table public.schools alter column code drop not null;
    end if;
    
    -- Add contact_number if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'contact_number'
    ) then
      alter table public.schools add column contact_number text;
    end if;
    
    -- Add email if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'email'
    ) then
      alter table public.schools add column email text;
    end if;
    
    -- Add registration_number if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'registration_number'
    ) then
      alter table public.schools add column registration_number text unique;
    end if;
    
    -- Add is_active if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'is_active'
    ) then
      alter table public.schools add column is_active boolean default true;
    end if;
    
    -- Add address if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'address'
    ) then
      alter table public.schools add column address text;
    end if;
    
    -- Add updated_at if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'updated_at'
    ) then
      alter table public.schools add column updated_at timestamp with time zone default now();
    end if;
    
  else
    -- Create schools table from scratch with all required columns
    create table public.schools (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      address text,
      contact_number text,
      email text,
      registration_number text unique,
      is_active boolean default true,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );
  end if;
end $$;

-- Add school_id to users table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'users' and column_name = 'school_id'
  ) then
    alter table public.users add column school_id uuid references public.schools(id) on delete set null;
  end if;
end $$;

-- Enable RLS on schools table
alter table public.schools enable row level security;

-- Drop and recreate RLS policies to ensure they're correct
drop policy if exists "Platform admins can select all schools" on public.schools;
create policy "Platform admins can select all schools"
  on public.schools for select
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin');

drop policy if exists "Platform admins can insert schools" on public.schools;
create policy "Platform admins can insert schools"
  on public.schools for insert
  to authenticated
  with check ((auth.jwt() ->> 'role')::text = 'platform_admin');

drop policy if exists "Platform admins can update schools" on public.schools;
create policy "Platform admins can update schools"
  on public.schools for update
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin')
  with check ((auth.jwt() ->> 'role')::text = 'platform_admin');

drop policy if exists "Platform admins can delete schools" on public.schools;
create policy "Platform admins can delete schools"
  on public.schools for delete
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin');

drop policy if exists "School admins can view their own school" on public.schools;
create policy "School admins can view their own school"
  on public.schools for select
  to authenticated
  using (
    exists (
      select 1 from public.users u 
      where u.id = auth.uid() 
      and u.role = 'school_admin' 
      and u.school_id = public.schools.id
    )
  );

-- Create or replace updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_schools_updated_at on public.schools;
create trigger handle_schools_updated_at
  before update on public.schools
  for each row execute function public.handle_updated_at();

-- Fix user RLS policies to prevent recursion
drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Platform admins can view all users" on public.users;
drop policy if exists "Platform admins can update users" on public.users;
drop policy if exists "Platform admins can insert users" on public.users;

create policy "Users can view own profile"
  on public.users for select
  to authenticated
  using (auth.uid() = id);

create policy "Platform admins can view all users"
  on public.users for select
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin');

create policy "Platform admins can update users"
  on public.users for update
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin')
  with check ((auth.jwt() ->> 'role')::text = 'platform_admin');

create policy "Platform admins can insert users"
  on public.users for insert
  to authenticated
  with check ((auth.jwt() ->> 'role')::text = 'platform_admin');

commit;
