-- Create audit logs and security monitoring tables
-- Run this in Supabase SQL Editor

-- Create audit_logs table for comprehensive activity tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- login, logout, create_user, update_role, etc.
  description TEXT NOT NULL,
  resource_type VARCHAR(50), -- user, role, setting, notification, etc.
  resource_id UUID, -- ID of the affected resource
  ip_address INET,
  user_agent TEXT,
  device_info JSONB, -- browser, OS, device details
  status VARCHAR(20) NOT NULL DEFAULT 'success', -- success, failure, warning
  severity VARCHAR(20) NOT NULL DEFAULT 'info', -- info, warning, error, critical
  metadata JSONB, -- additional context data
  session_id VARCHAR(255), -- track user sessions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_alerts table for automated threat detection
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type VARCHAR(50) NOT NULL, -- failed_login_attempts, suspicious_activity, etc.
  severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  metadata JSONB, -- alert-specific data
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, investigating, resolved, false_positive
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_log_archive table for 90+ day old logs
CREATE TABLE IF NOT EXISTS public.audit_log_archive (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'success',
  severity VARCHAR(20) NOT NULL DEFAULT 'info',
  metadata JSONB,
  session_id VARCHAR(255),
  original_created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON public.audit_logs (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created ON public.audit_logs (action, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status_created ON public.audit_logs (status, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity_created ON public.audit_logs (severity, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_created ON public.audit_logs (ip_address, created_at);

CREATE INDEX IF NOT EXISTS idx_security_alerts_type_created ON public.security_alerts (alert_type, created_at);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity_status ON public.security_alerts (severity, status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_user_created ON public.security_alerts (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_security_alerts_ip_created ON public.security_alerts (ip_address, created_at);

CREATE INDEX IF NOT EXISTS idx_audit_archive_user_created ON public.audit_log_archive (user_id, original_created_at);
CREATE INDEX IF NOT EXISTS idx_audit_archive_action_created ON public.audit_log_archive (action, original_created_at);
CREATE INDEX IF NOT EXISTS idx_audit_archive_original_created ON public.audit_log_archive (original_created_at);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log_archive ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit_logs (admin only access)
CREATE POLICY "Platform admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for security_alerts (admin only access)
CREATE POLICY "Platform admins can view all security alerts" ON public.security_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Platform admins can update security alerts" ON public.security_alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "System can insert security alerts" ON public.security_alerts
  FOR INSERT WITH CHECK (true);

-- RLS Policies for audit_log_archive (admin only access)
CREATE POLICY "Platform admins can view archived audit logs" ON public.audit_log_archive
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

-- Function to automatically archive old audit logs
CREATE OR REPLACE FUNCTION archive_old_audit_logs()
RETURNS void AS $$
BEGIN
  -- Move logs older than 90 days to archive
  INSERT INTO public.audit_log_archive (
    original_id, user_id, action, description, resource_type, resource_id,
    ip_address, user_agent, device_info, status, severity, metadata,
    session_id, original_created_at
  )
  SELECT 
    id, user_id, action, description, resource_type, resource_id,
    ip_address, user_agent, device_info, status, severity, metadata,
    session_id, created_at
  FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Delete archived logs from main table
  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to detect and create security alerts
CREATE OR REPLACE FUNCTION detect_security_threats()
RETURNS void AS $$
DECLARE
  failed_login_threshold INTEGER := 5;
  time_window INTERVAL := '15 minutes';
  suspicious_record RECORD;
BEGIN
  -- Detect multiple failed login attempts
  FOR suspicious_record IN
    SELECT 
      user_id,
      ip_address,
      COUNT(*) as failed_attempts,
      MAX(created_at) as last_attempt
    FROM public.audit_logs
    WHERE action = 'login'
      AND status = 'failure'
      AND created_at > NOW() - time_window
    GROUP BY user_id, ip_address
    HAVING COUNT(*) >= failed_login_threshold
  LOOP
    -- Create security alert if not already exists
    INSERT INTO public.security_alerts (
      alert_type,
      severity,
      title,
      description,
      user_id,
      ip_address,
      metadata
    )
    SELECT
      'failed_login_attempts',
      'high',
      'Multiple Failed Login Attempts',
      format('User attempted to login %s times from IP %s in the last %s', 
             suspicious_record.failed_attempts, 
             suspicious_record.ip_address, 
             time_window),
      suspicious_record.user_id,
      suspicious_record.ip_address,
      jsonb_build_object(
        'failed_attempts', suspicious_record.failed_attempts,
        'time_window', time_window,
        'last_attempt', suspicious_record.last_attempt
      )
    WHERE NOT EXISTS (
      SELECT 1 FROM public.security_alerts
      WHERE alert_type = 'failed_login_attempts'
        AND user_id = suspicious_record.user_id
        AND ip_address = suspicious_record.ip_address
        AND status = 'active'
        AND created_at > NOW() - time_window
    );
  END LOOP;
  
  -- Detect unusual admin activity (multiple role changes in short time)
  FOR suspicious_record IN
    SELECT 
      user_id,
      COUNT(*) as role_changes,
      MAX(created_at) as last_change
    FROM public.audit_logs
    WHERE action IN ('update_role', 'assign_role', 'remove_role')
      AND created_at > NOW() - INTERVAL '1 hour'
    GROUP BY user_id
    HAVING COUNT(*) >= 10
  LOOP
    INSERT INTO public.security_alerts (
      alert_type,
      severity,
      title,
      description,
      user_id,
      metadata
    )
    SELECT
      'excessive_role_changes',
      'medium',
      'Excessive Role Changes Detected',
      format('Admin performed %s role changes in the last hour', 
             suspicious_record.role_changes),
      suspicious_record.user_id,
      jsonb_build_object(
        'role_changes', suspicious_record.role_changes,
        'last_change', suspicious_record.last_change
      )
    WHERE NOT EXISTS (
      SELECT 1 FROM public.security_alerts
      WHERE alert_type = 'excessive_role_changes'
        AND user_id = suspicious_record.user_id
        AND status = 'active'
        AND created_at > NOW() - INTERVAL '1 hour'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action VARCHAR(100),
  p_description TEXT,
  p_resource_type VARCHAR(50) DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_info JSONB DEFAULT NULL,
  p_status VARCHAR(20) DEFAULT 'success',
  p_severity VARCHAR(20) DEFAULT 'info',
  p_metadata JSONB DEFAULT NULL,
  p_session_id VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, description, resource_type, resource_id,
    ip_address, user_agent, device_info, status, severity,
    metadata, session_id
  ) VALUES (
    p_user_id, p_action, p_description, p_resource_type, p_resource_id,
    p_ip_address, p_user_agent, p_device_info, p_status, p_severity,
    p_metadata, p_session_id
  ) RETURNING id INTO log_id;
  
  -- Trigger security threat detection
  PERFORM detect_security_threats();
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_security_alerts_updated_at
  BEFORE UPDATE ON public.security_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample audit log entries for testing
INSERT INTO public.audit_logs (user_id, action, description, ip_address, status, severity) VALUES
(NULL, 'system_startup', 'SchoolConnect system started', '127.0.0.1'::inet, 'success', 'info'),
(NULL, 'database_migration', 'Audit logs table created', '127.0.0.1'::inet, 'success', 'info');

-- Insert sample security alert for testing
INSERT INTO public.security_alerts (alert_type, severity, title, description, ip_address, metadata) VALUES
('system_initialization', 'info', 'Audit System Initialized', 'Audit logging and security monitoring system has been successfully initialized', '127.0.0.1'::inet, '{"component": "audit_system", "version": "1.0"}');

-- Create scheduled job to run archival daily (requires pg_cron extension)
-- SELECT cron.schedule('archive-audit-logs', '0 2 * * *', 'SELECT archive_old_audit_logs();');

-- Create scheduled job to run security detection every 5 minutes
-- SELECT cron.schedule('security-threat-detection', '*/5 * * * *', 'SELECT detect_security_threats();');
