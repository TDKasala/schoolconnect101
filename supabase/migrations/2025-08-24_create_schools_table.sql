-- Create schools table and update users table for school management
-- This enables Platform Admins to create schools and assign School Admins

begin;

-- Create schools table
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  contact_number text,
  email text,
  registration_number text unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

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

-- RLS Policies for schools table
-- Policy 1: Platform admins can select all schools
drop policy if exists "Platform admins can select all schools" on public.schools;
create policy "Platform admins can select all schools"
  on public.schools for select
  to authenticated
  using (
    (auth.jwt() ->> 'role')::text = 'platform_admin'
  );

-- Policy 2: Platform admins can insert schools
drop policy if exists "Platform admins can insert schools" on public.schools;
create policy "Platform admins can insert schools"
  on public.schools for insert
  to authenticated
  with check (
    (auth.jwt() ->> 'role')::text = 'platform_admin'
  );

-- Policy 3: Platform admins can update schools
drop policy if exists "Platform admins can update schools" on public.schools;
create policy "Platform admins can update schools"
  on public.schools for update
  to authenticated
  using (
    (auth.jwt() ->> 'role')::text = 'platform_admin'
  )
  with check (
    (auth.jwt() ->> 'role')::text = 'platform_admin'
  );

-- Policy 4: Platform admins can delete schools
drop policy if exists "Platform admins can delete schools" on public.schools;
create policy "Platform admins can delete schools"
  on public.schools for delete
  to authenticated
  using (
    (auth.jwt() ->> 'role')::text = 'platform_admin'
  );

-- Policy 5: School admins can view their own school
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

-- Create updated_at trigger for schools table
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

commit;
