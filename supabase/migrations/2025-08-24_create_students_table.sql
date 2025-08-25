-- Create students table to resolve 404 errors
-- This table is referenced by school statistics components

begin;

-- Create students table
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  student_number text unique,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  gender text check (gender in ('M', 'F')),
  class_id uuid,
  parent_id uuid references public.users(id) on delete set null,
  enrollment_date date default current_date,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on students table
alter table public.students enable row level security;

-- RLS Policies for students table
-- Policy 1: Platform admins can select all students
drop policy if exists "Platform admins can select all students" on public.students;
create policy "Platform admins can select all students"
  on public.students for select
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin');

-- Policy 2: School admins can view students in their school
drop policy if exists "School admins can view students in their school" on public.students;
create policy "School admins can view students in their school"
  on public.students for select
  to authenticated
  using (
    exists (
      select 1 from public.users u 
      where u.id = auth.uid() 
      and u.role = 'school_admin' 
      and u.school_id = public.students.school_id
    )
  );

-- Policy 3: Teachers can view students in their school
drop policy if exists "Teachers can view students in their school" on public.students;
create policy "Teachers can view students in their school"
  on public.students for select
  to authenticated
  using (
    exists (
      select 1 from public.users u 
      where u.id = auth.uid() 
      and u.role = 'teacher' 
      and u.school_id = public.students.school_id
    )
  );

-- Policy 4: Parents can view their own children
drop policy if exists "Parents can view their own children" on public.students;
create policy "Parents can view their own children"
  on public.students for select
  to authenticated
  using (
    auth.uid() = parent_id or 
    exists (
      select 1 from public.users u 
      where u.id = auth.uid() 
      and u.role = 'parent'
      and u.id = public.students.parent_id
    )
  );

-- Policy 5: Platform admins can insert students
drop policy if exists "Platform admins can insert students" on public.students;
create policy "Platform admins can insert students"
  on public.students for insert
  to authenticated
  with check ((auth.jwt() ->> 'role')::text = 'platform_admin');

-- Policy 6: School admins can insert students in their school
drop policy if exists "School admins can insert students in their school" on public.students;
create policy "School admins can insert students in their school"
  on public.students for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users u 
      where u.id = auth.uid() 
      and u.role = 'school_admin' 
      and u.school_id = public.students.school_id
    )
  );

-- Policy 7: Platform admins can update students
drop policy if exists "Platform admins can update students" on public.students;
create policy "Platform admins can update students"
  on public.students for update
  to authenticated
  using ((auth.jwt() ->> 'role')::text = 'platform_admin')
  with check ((auth.jwt() ->> 'role')::text = 'platform_admin');

-- Policy 8: School admins can update students in their school
drop policy if exists "School admins can update students in their school" on public.students;
create policy "School admins can update students in their school"
  on public.students for update
  to authenticated
  using (
    exists (
      select 1 from public.users u 
      where u.id = auth.uid() 
      and u.role = 'school_admin' 
      and u.school_id = public.students.school_id
    )
  )
  with check (
    exists (
      select 1 from public.users u 
      where u.id = auth.uid() 
      and u.role = 'school_admin' 
      and u.school_id = public.students.school_id
    )
  );

-- Create updated_at trigger for students
drop trigger if exists handle_students_updated_at on public.students;
create trigger handle_students_updated_at
  before update on public.students
  for each row execute function public.handle_updated_at();

-- Create index for better performance
create index if not exists idx_students_school_id on public.students(school_id);
create index if not exists idx_students_parent_id on public.students(parent_id);
create index if not exists idx_students_user_id on public.students(user_id);

commit;
