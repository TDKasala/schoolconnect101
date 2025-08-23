-- Fix existing policy conflicts by dropping and recreating them
-- This script handles cases where policies already exist

-- Drop existing policies if they exist (messaging tables)
DROP POLICY IF EXISTS "Platform admins can manage all platform messages" ON public.platform_messages;
DROP POLICY IF EXISTS "Users can view messages sent to them" ON public.platform_messages;
DROP POLICY IF EXISTS "Platform admins can manage all message recipients" ON public.message_recipients;
DROP POLICY IF EXISTS "Users can view their own message recipient records" ON public.message_recipients;
DROP POLICY IF EXISTS "Platform admins can manage all platform announcements" ON public.platform_announcements;
DROP POLICY IF EXISTS "Users can view announcements targeted to their role" ON public.platform_announcements;
DROP POLICY IF EXISTS "Platform admins can manage all announcement views" ON public.announcement_views;
DROP POLICY IF EXISTS "Users can manage their own announcement views" ON public.announcement_views;
DROP POLICY IF EXISTS "Platform admins can view all communication logs" ON public.communication_logs;

-- Drop existing policies if they exist (audit tables)
DROP POLICY IF EXISTS "Platform admins can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Platform admins can view all security alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Platform admins can manage security alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Platform admins can view audit log archive" ON public.audit_log_archive;

-- Recreate messaging policies
CREATE POLICY "Platform admins can manage all platform messages" ON public.platform_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Users can view messages sent to them" ON public.platform_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT recipient_id FROM public.message_recipients 
      WHERE message_id = platform_messages.id
    )
  );

CREATE POLICY "Platform admins can manage all message recipients" ON public.message_recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Users can view their own message recipient records" ON public.message_recipients
  FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Platform admins can manage all platform announcements" ON public.platform_announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Users can view announcements targeted to their role" ON public.platform_announcements
  FOR SELECT USING (
    target_roles ? (
      SELECT raw_user_meta_data->>'role' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
    OR target_roles IS NULL
  );

CREATE POLICY "Platform admins can manage all announcement views" ON public.announcement_views
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Users can manage their own announcement views" ON public.announcement_views
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Platform admins can view all communication logs" ON public.communication_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

-- Recreate audit policies
CREATE POLICY "Platform admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Platform admins can view all security alerts" ON public.security_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Platform admins can manage security alerts" ON public.security_alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Platform admins can view audit log archive" ON public.audit_log_archive
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );
