-- Create roles and user_roles tables for Role Management feature
-- Run this in Supabase SQL Editor

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles junction table for role assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Enable RLS on both tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for roles table (admin only)
CREATE POLICY "roles_admin_all" ON public.roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'platform_admin' 
      AND approved = true
    )
  );

-- Create policies for user_roles table (admin only)
CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'platform_admin' 
      AND approved = true
    )
  );

-- Insert default roles
INSERT INTO public.roles (name, description, permissions) VALUES
  ('editor', 'Can edit content and manage posts', '["content.edit", "content.create", "content.delete"]'),
  ('moderator', 'Can moderate users and content', '["users.moderate", "content.moderate", "reports.view"]'),
  ('viewer', 'Can view content only', '["content.view"]'),
  ('manager', 'Can manage users and basic admin tasks', '["users.manage", "content.manage", "reports.view"]')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);

-- Verify tables were created
SELECT 'Roles table created' as status, count(*) as role_count FROM public.roles;
SELECT 'User roles table created' as status, count(*) as assignment_count FROM public.user_roles;
