-- Create settings table for Settings Management feature
-- Run this in Supabase SQL Editor

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'string',
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "settings_admin_all" ON public.settings;

-- Create policy for settings table (admin only)
CREATE POLICY "settings_admin_all" ON public.settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'platform_admin' 
      AND approved = true
    )
  );

-- Insert default settings
INSERT INTO public.settings (key, value, type, category, description) VALUES
  -- General Settings
  ('platform_name', 'SchoolConnect', 'string', 'general', 'Name of the platform'),
  ('platform_logo_url', '', 'url', 'general', 'URL to platform logo'),
  ('primary_color', '#3B82F6', 'color', 'general', 'Primary brand color'),
  ('secondary_color', '#6B7280', 'color', 'general', 'Secondary brand color'),
  
  -- Authentication Settings
  ('allow_new_registrations', 'true', 'boolean', 'authentication', 'Allow new user registrations'),
  ('require_email_verification', 'true', 'boolean', 'authentication', 'Require email verification for new users'),
  ('session_timeout', '480', 'number', 'authentication', 'Session timeout in minutes'),
  
  -- Notifications Settings
  ('default_email_sender', 'noreply@schoolconnect.com', 'email', 'notifications', 'Default email sender address'),
  ('enable_push_notifications', 'true', 'boolean', 'notifications', 'Enable push notifications'),
  ('enable_system_alerts', 'true', 'boolean', 'notifications', 'Enable system alert notifications'),
  
  -- Branding Settings
  ('logo_upload_url', '', 'url', 'branding', 'Uploaded logo URL'),
  ('favicon_url', '/favicon.ico', 'url', 'branding', 'Favicon URL'),
  ('footer_text', '© 2025 SchoolConnect. All rights reserved.', 'string', 'branding', 'Footer text displayed across the platform')
ON CONFLICT (key) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  type = EXCLUDED.type;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON public.settings(category);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS trigger_update_settings_updated_at ON public.settings;
CREATE TRIGGER trigger_update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- Verify table was created
SELECT 'Settings table created' as status, count(*) as setting_count FROM public.settings;
