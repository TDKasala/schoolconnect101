-- Create notifications and user_notifications tables for Notifications & System Alerts feature
-- Run this in Supabase SQL Editor

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  recipient_role VARCHAR(50), -- null means all users
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published, archived
  importance VARCHAR(20) NOT NULL DEFAULT 'normal', -- low, normal, high, critical
  type VARCHAR(50) NOT NULL DEFAULT 'announcement', -- announcement, system_alert, maintenance
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_notifications table to track read status
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(notification_id, user_id)
);

-- Create system_alerts table for critical system events
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type VARCHAR(100) NOT NULL, -- failed_login, quota_exceeded, service_downtime, etc.
  severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "notifications_admin_all" ON public.notifications;
DROP POLICY IF EXISTS "notifications_users_read" ON public.notifications;
DROP POLICY IF EXISTS "user_notifications_own" ON public.user_notifications;
DROP POLICY IF EXISTS "system_alerts_admin_all" ON public.system_alerts;

-- Notifications policies
-- Admins can manage all notifications
CREATE POLICY "notifications_admin_all" ON public.notifications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'platform_admin' 
      AND approved = true
    )
  );

-- Users can read published notifications meant for their role or all users
CREATE POLICY "notifications_users_read" ON public.notifications
  FOR SELECT
  USING (
    status = 'published' 
    AND (published_at IS NULL OR published_at <= NOW())
    AND (
      recipient_role IS NULL 
      OR recipient_role = (
        SELECT role FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- User notifications policies
-- Users can only see their own notification read status
CREATE POLICY "user_notifications_own" ON public.user_notifications
  FOR ALL
  USING (user_id = auth.uid());

-- System alerts policies  
-- Only admins can manage system alerts
CREATE POLICY "system_alerts_admin_all" ON public.system_alerts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'platform_admin' 
      AND approved = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_role ON public.notifications(recipient_role);
CREATE INDEX IF NOT EXISTS idx_notifications_published_at ON public.notifications(published_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_notification_id ON public.user_notifications(notification_id);
CREATE INDEX IF NOT EXISTS idx_system_alerts_alert_type ON public.system_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_system_alerts_resolved ON public.system_alerts(resolved);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS trigger_update_notifications_updated_at ON public.notifications;
CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Create function to auto-create user_notifications when notification is published
CREATE OR REPLACE FUNCTION create_user_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create user notifications when status changes to published
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    -- Insert notification for all eligible users
    INSERT INTO public.user_notifications (notification_id, user_id)
    SELECT NEW.id, u.id
    FROM public.users u
    WHERE u.approved = true
    AND (NEW.recipient_role IS NULL OR u.role = NEW.recipient_role)
    ON CONFLICT (notification_id, user_id) DO NOTHING;
    
    -- Update published_at timestamp
    NEW.published_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-creating user notifications
DROP TRIGGER IF EXISTS trigger_create_user_notifications ON public.notifications;
CREATE TRIGGER trigger_create_user_notifications
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION create_user_notifications();

-- Insert sample notifications
INSERT INTO public.notifications (title, message, recipient_role, status, importance, type, created_by) VALUES
  ('Welcome to SchoolConnect', 'Welcome to the SchoolConnect platform! We''re excited to have you on board.', NULL, 'published', 'normal', 'announcement', (SELECT id FROM auth.users LIMIT 1)),
  ('System Maintenance Scheduled', 'Scheduled maintenance will occur this weekend from 2 AM to 4 AM.', NULL, 'published', 'high', 'maintenance', (SELECT id FROM auth.users LIMIT 1)),
  ('Teacher Training Session', 'New teacher training session available in the learning center.', 'teacher', 'published', 'normal', 'announcement', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample system alert
INSERT INTO public.system_alerts (alert_type, severity, title, description, metadata) VALUES
  ('system_startup', 'low', 'System Initialized', 'Notification system has been successfully initialized.', '{"version": "1.0.0", "timestamp": "2025-08-23T19:44:36+02:00"}')
ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT 'Notifications table created' as status, count(*) as notification_count FROM public.notifications;
SELECT 'User notifications table created' as status, count(*) as user_notification_count FROM public.user_notifications;
SELECT 'System alerts table created' as status, count(*) as alert_count FROM public.system_alerts;
