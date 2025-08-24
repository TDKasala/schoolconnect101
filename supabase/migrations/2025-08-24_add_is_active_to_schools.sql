-- Add is_active column to schools table
-- This fixes the 400 error when querying schools with is_active filter

begin;

-- Add is_active column if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'schools' and column_name = 'is_active'
  ) then
    alter table public.schools add column is_active boolean default true;
  end if;
end $$;

-- Update existing schools to be active by default
update public.schools set is_active = true where is_active is null;

commit;
