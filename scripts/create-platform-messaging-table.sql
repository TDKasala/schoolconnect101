-- Create platform messaging and notifications tables
-- Run this in Supabase SQL Editor

-- Create platform_messages table for system-wide communications
CREATE TABLE IF NOT EXISTS public.platform_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL DEFAULT 'announcement', -- announcement, alert, maintenance, update
  priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- low, normal, high, urgent
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  target_audience JSONB NOT NULL, -- {schools: [], roles: [], specific_users: []}
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, scheduled, sent, archived
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB, -- additional data like attachments, links
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_recipients table to track who received each message
CREATE TABLE IF NOT EXISTS public.message_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.platform_messages(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID, -- if applicable
  recipient_role VARCHAR(50), -- teacher, parent, school_admin, etc.
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, recipient_id)
);

-- Create platform_announcements table for broadcast messages
CREATE TABLE IF NOT EXISTS public.platform_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  announcement_type VARCHAR(50) NOT NULL DEFAULT 'general', -- general, maintenance, feature, policy
  priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- low, normal, high, critical
  target_schools JSONB, -- array of school IDs, null means all schools
  target_roles JSONB, -- array of roles, null means all roles
  is_pinned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcement_views table to track who has seen announcements
CREATE TABLE IF NOT EXISTS public.announcement_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES public.platform_announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID, -- user's school context
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dismissed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(announcement_id, user_id)
);

-- Create communication_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.communication_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  communication_type VARCHAR(50) NOT NULL, -- message, announcement, notification
  communication_id UUID NOT NULL, -- references the specific message/announcement
  action VARCHAR(50) NOT NULL, -- sent, delivered, read, archived, etc.
  user_id UUID REFERENCES auth.users(id),
  school_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_messages_status_created ON public.platform_messages (status, created_at);
CREATE INDEX IF NOT EXISTS idx_platform_messages_sender_created ON public.platform_messages (sender_id, created_at);
CREATE INDEX IF NOT EXISTS idx_platform_messages_type_created ON public.platform_messages (message_type, created_at);
CREATE INDEX IF NOT EXISTS idx_platform_messages_scheduled ON public.platform_messages (scheduled_for) WHERE scheduled_for IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_message_recipients_message ON public.message_recipients (message_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_recipient ON public.message_recipients (recipient_id, delivered_at);
CREATE INDEX IF NOT EXISTS idx_message_recipients_school ON public.message_recipients (school_id, delivered_at);
CREATE INDEX IF NOT EXISTS idx_message_recipients_read ON public.message_recipients (read_at) WHERE read_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_platform_announcements_active ON public.platform_announcements (is_active, published_at);
CREATE INDEX IF NOT EXISTS idx_platform_announcements_type_created ON public.platform_announcements (announcement_type, created_at);
CREATE INDEX IF NOT EXISTS idx_platform_announcements_priority ON public.platform_announcements (priority, published_at);
CREATE INDEX IF NOT EXISTS idx_platform_announcements_expires ON public.platform_announcements (expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_announcement_views_announcement ON public.announcement_views (announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_views_user ON public.announcement_views (user_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_announcement_views_school ON public.announcement_views (school_id, viewed_at);

CREATE INDEX IF NOT EXISTS idx_communication_logs_type_created ON public.communication_logs (communication_type, created_at);
CREATE INDEX IF NOT EXISTS idx_communication_logs_user_created ON public.communication_logs (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_communication_logs_school_created ON public.communication_logs (school_id, created_at);

-- Enable Row Level Security
ALTER TABLE public.platform_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_messages (platform admin full access)
CREATE POLICY "Platform admins can manage all platform messages" ON public.platform_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

-- RLS Policies for message_recipients (platform admin and recipients can view)
CREATE POLICY "Platform admins can view all message recipients" ON public.message_recipients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Users can view their own message receipts" ON public.message_recipients
  FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own message status" ON public.message_recipients
  FOR UPDATE USING (recipient_id = auth.uid());

-- RLS Policies for platform_announcements (platform admin full access)
CREATE POLICY "Platform admins can manage all announcements" ON public.platform_announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Users can view active announcements" ON public.platform_announcements
  FOR SELECT USING (
    is_active = true 
    AND published_at IS NOT NULL 
    AND published_at <= NOW()
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- RLS Policies for announcement_views (platform admin and users)
CREATE POLICY "Platform admins can view all announcement views" ON public.announcement_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "Users can manage their own announcement views" ON public.announcement_views
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for communication_logs (platform admin only)
CREATE POLICY "Platform admins can view all communication logs" ON public.communication_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

CREATE POLICY "System can insert communication logs" ON public.communication_logs
  FOR INSERT WITH CHECK (true);

-- Function to automatically create message recipients when a message is sent
CREATE OR REPLACE FUNCTION create_message_recipients()
RETURNS TRIGGER AS $$
DECLARE
  target_user RECORD;
  audience JSONB;
BEGIN
  -- Only process when status changes to 'sent'
  IF NEW.status = 'sent' AND (OLD.status IS NULL OR OLD.status != 'sent') THEN
    audience := NEW.target_audience;
    
    -- Update sent_at timestamp
    NEW.sent_at := NOW();
    
    -- Create recipients based on target audience
    FOR target_user IN
      SELECT DISTINCT u.id as user_id, u.raw_user_meta_data->>'school_id' as school_id, u.raw_user_meta_data->>'role' as user_role
      FROM auth.users u
      WHERE 
        -- Check if user matches target schools (if specified)
        (audience->>'schools' IS NULL OR 
         audience->'schools' @> to_jsonb(u.raw_user_meta_data->>'school_id'))
        AND
        -- Check if user matches target roles (if specified)
        (audience->>'roles' IS NULL OR 
         audience->'roles' @> to_jsonb(u.raw_user_meta_data->>'role'))
        AND
        -- Check if user is in specific users list (if specified)
        (audience->>'specific_users' IS NULL OR 
         audience->'specific_users' @> to_jsonb(u.id::text))
    LOOP
      INSERT INTO public.message_recipients (
        message_id, 
        recipient_id, 
        school_id, 
        recipient_role
      ) VALUES (
        NEW.id,
        target_user.user_id::uuid,
        target_user.school_id::uuid,
        target_user.user_role
      ) ON CONFLICT (message_id, recipient_id) DO NOTHING;
    END LOOP;
    
    -- Log the communication
    INSERT INTO public.communication_logs (
      communication_type,
      communication_id,
      action,
      user_id,
      metadata
    ) VALUES (
      'message',
      NEW.id,
      'sent',
      NEW.sender_id,
      jsonb_build_object(
        'title', NEW.title,
        'message_type', NEW.message_type,
        'target_audience', NEW.target_audience
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for message recipients
CREATE TRIGGER trigger_create_message_recipients
  BEFORE UPDATE ON public.platform_messages
  FOR EACH ROW
  EXECUTE FUNCTION create_message_recipients();

-- Function to log announcement views
CREATE OR REPLACE FUNCTION log_announcement_view()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the view in communication logs
  INSERT INTO public.communication_logs (
    communication_type,
    communication_id,
    action,
    user_id,
    school_id,
    metadata
  ) VALUES (
    'announcement',
    NEW.announcement_id,
    'viewed',
    NEW.user_id,
    NEW.school_id,
    jsonb_build_object('viewed_at', NEW.viewed_at)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for announcement views
CREATE TRIGGER trigger_log_announcement_view
  AFTER INSERT ON public.announcement_views
  FOR EACH ROW
  EXECUTE FUNCTION log_announcement_view();

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_messages_updated_at
  BEFORE UPDATE ON public.platform_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_announcements_updated_at
  BEFORE UPDATE ON public.platform_announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.platform_announcements (
  title,
  content,
  announcement_type,
  priority,
  target_schools,
  target_roles,
  is_pinned,
  published_at,
  created_by
) VALUES (
  'Welcome to SchoolConnect Platform',
  'Welcome to the SchoolConnect platform! This is a sample announcement to demonstrate the messaging system.',
  'general',
  'normal',
  NULL, -- all schools
  NULL, -- all roles
  true,
  NOW(),
  (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'platform_admin' LIMIT 1)
) ON CONFLICT DO NOTHING;

-- Insert sample platform message
INSERT INTO public.platform_messages (
  title,
  content,
  message_type,
  priority,
  sender_id,
  target_audience,
  status
) VALUES (
  'Platform Messaging System Initialized',
  'The platform messaging system has been successfully set up and is ready for use.',
  'update',
  'normal',
  (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'platform_admin' LIMIT 1),
  '{"schools": null, "roles": ["platform_admin"], "specific_users": null}',
  'draft'
) ON CONFLICT DO NOTHING;
