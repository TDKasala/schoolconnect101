-- Align database schema with new User Management requirements
-- This migration updates tables to match the exact specifications

begin;

-- Update schools table to match new requirements
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
    -- Add new required columns if they don't exist
    
    -- Add city if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'city'
    ) then
      alter table public.schools add column city text;
    end if;
    
    -- Add province if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'province'
    ) then
      alter table public.schools add column province text;
    end if;
    
    -- Add country if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'country'
    ) then
      alter table public.schools add column country text default 'République Démocratique du Congo';
    end if;
    
    -- Add phone if missing (rename contact_number if it exists)
    if exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'contact_number'
    ) and not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'phone'
    ) then
      alter table public.schools rename column contact_number to phone;
    elsif not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'phone'
    ) then
      alter table public.schools add column phone text;
    end if;
    
    -- Add max_students if missing
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'max_students'
    ) then
      alter table public.schools add column max_students integer;
    end if;
    
    -- Ensure is_active exists
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'is_active'
    ) then
      alter table public.schools add column is_active boolean default true;
    end if;
    
    -- Ensure updated_at exists
    if not exists (
      select 1 from information_schema.columns 
      where table_name = 'schools' and column_name = 'updated_at'
    ) then
      alter table public.schools add column updated_at timestamp with time zone default now();
    end if;
    
  else
    -- Create schools table from scratch with new schema
    create table public.schools (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      address text,
      city text,
      province text,
      country text default 'République Démocratique du Congo',
      phone text,
      email text,
      max_students integer,
      is_active boolean default true,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );
  end if;
end $$;

-- Update users table to match new requirements
do $$
begin
  -- Add is_active if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'users' and column_name = 'is_active'
  ) then
    alter table public.users add column is_active boolean default true;
  end if;
  
  -- Add updated_at if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'users' and column_name = 'updated_at'
  ) then
    alter table public.users add column updated_at timestamp with time zone default now();
  end if;
  
  -- Add school_id if missing
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'users' and column_name = 'school_id'
  ) then
    alter table public.users add column school_id uuid references public.schools(id) on delete set null;
  end if;
end $$;

-- Create activity_logs table for audit trail
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on activity_logs
alter table public.activity_logs enable row level security;

-- RLS policy for activity_logs - platform admins can view all
drop policy if exists "Platform admins can view all activity logs" on public.activity_logs;
create policy "Platform admins can view all activity logs"
  on public.activity_logs for select
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin');

-- RLS policy for activity_logs - platform admins can insert
drop policy if exists "Platform admins can insert activity logs" on public.activity_logs;
create policy "Platform admins can insert activity logs"
  on public.activity_logs for insert
  to authenticated
  with check ((auth.jwt() ->> 'role')::text = 'platform_admin');

-- Enable RLS on schools and users tables
alter table public.schools enable row level security;
alter table public.users enable row level security;

-- Update schools RLS policies
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

-- Update users RLS policies (JWT-based to prevent recursion)
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

-- Create updated_at triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for schools
drop trigger if exists handle_schools_updated_at on public.schools;
create trigger handle_schools_updated_at
  before update on public.schools
  for each row execute function public.handle_updated_at();

-- Trigger for users
drop trigger if exists handle_users_updated_at on public.users;
create trigger handle_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

commit;
