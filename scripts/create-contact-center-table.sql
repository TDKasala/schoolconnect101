-- Contact Center / Support Inbox Database Schema
-- This script creates tables for managing contact messages and admin responses

-- Create contact_messages table for all incoming messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(50),
  sender_organization VARCHAR(255), -- school name or organization
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL DEFAULT 'general', -- general, support, complaint, feature_request, bug_report
  priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- low, normal, high, urgent
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, read, in_progress, responded, closed
  assigned_to UUID REFERENCES auth.users(id), -- admin user assigned to handle this message
  school_id UUID, -- if message is from a school user
  source VARCHAR(50) NOT NULL DEFAULT 'contact_form', -- contact_form, email, phone, chat
  ip_address INET,
  user_agent TEXT,
  metadata JSONB, -- additional data like form fields, attachments, etc.
  read_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_responses table for tracking responses to contact messages
CREATE TABLE IF NOT EXISTS public.admin_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  response_text TEXT NOT NULL,
  response_type VARCHAR(50) NOT NULL DEFAULT 'email', -- email, phone, internal_note
  is_internal_note BOOLEAN DEFAULT false, -- true for internal notes, false for responses sent to user
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_attachments table for file uploads
CREATE TABLE IF NOT EXISTS public.message_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  file_url TEXT NOT NULL, -- Supabase storage URL
  uploaded_by UUID REFERENCES auth.users(id), -- null for public uploads, admin_id for admin uploads
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_center_settings table for admin preferences
CREATE TABLE IF NOT EXISTS public.contact_center_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  auto_assign_enabled BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  default_response_template TEXT,
  signature TEXT,
  settings JSONB, -- additional preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(admin_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created ON public.contact_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_assigned_status ON public.contact_messages (assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type_priority ON public.contact_messages (message_type, priority);
CREATE INDEX IF NOT EXISTS idx_contact_messages_sender_email ON public.contact_messages (sender_email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_school_id ON public.contact_messages (school_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_responses_message_id ON public.admin_responses (message_id, created_at);
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON public.message_attachments (message_id);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_center_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_messages
CREATE POLICY "Platform admins can manage all contact messages" ON public.contact_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

-- RLS Policies for admin_responses
CREATE POLICY "Platform admins can manage all admin responses" ON public.admin_responses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

-- RLS Policies for message_attachments
CREATE POLICY "Platform admins can manage all message attachments" ON public.message_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

-- Allow public to insert contact messages (for contact form)
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow public to upload attachments for their messages
CREATE POLICY "Anyone can upload attachments for contact messages" ON public.message_attachments
  FOR INSERT WITH CHECK (uploaded_by IS NULL);

-- RLS Policies for contact_center_settings
CREATE POLICY "Admins can manage their own contact center settings" ON public.contact_center_settings
  FOR ALL USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'platform_admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_responses_updated_at
  BEFORE UPDATE ON public.admin_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_center_settings_updated_at
  BEFORE UPDATE ON public.contact_center_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update message status when response is added
CREATE OR REPLACE FUNCTION update_message_status_on_response()
RETURNS TRIGGER AS $$
BEGIN
  -- Update message status to 'responded' and set responded_at timestamp
  UPDATE public.contact_messages 
  SET 
    status = CASE 
      WHEN status = 'new' THEN 'responded'
      WHEN status = 'read' THEN 'responded'
      WHEN status = 'in_progress' THEN 'responded'
      ELSE status
    END,
    responded_at = CASE 
      WHEN responded_at IS NULL THEN NOW()
      ELSE responded_at
    END,
    updated_at = NOW()
  WHERE id = NEW.message_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status updates
CREATE TRIGGER update_message_status_on_response_trigger
  AFTER INSERT ON public.admin_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_message_status_on_response();

-- Insert sample data for testing (only if platform admin exists)
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if platform admin exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE raw_user_meta_data->>'role' = 'platform_admin' 
  LIMIT 1;
  
  -- Only insert sample data if admin user exists
  IF admin_user_id IS NOT NULL THEN
    -- Insert sample contact messages
    INSERT INTO public.contact_messages (
      sender_name,
      sender_email,
      sender_phone,
      sender_organization,
      subject,
      message,
      message_type,
      priority,
      status,
      source,
      created_at
    ) VALUES 
    (
      'Jean Mukendi',
      'jean.mukendi@ecole-kinshasa.cd',
      '+243 81 234 5678',
      'École Primaire de Kinshasa',
      'Problème de connexion au système',
      'Bonjour, nous avons des difficultés à nous connecter au système SchoolConnect depuis ce matin. Pouvez-vous nous aider?',
      'support',
      'high',
      'new',
      'contact_form',
      NOW() - INTERVAL '2 hours'
    ),
    (
      'Marie Kabila',
      'marie.kabila@gmail.com',
      '+243 99 876 5432',
      NULL,
      'Demande d''information sur les tarifs',
      'Je souhaiterais avoir des informations sur les tarifs de votre plateforme pour notre école.',
      'general',
      'normal',
      'read',
      'contact_form',
      NOW() - INTERVAL '1 day'
    ),
    (
      'Pierre Tshisekedi',
      'pierre.t@lycee-lubumbashi.cd',
      '+243 97 123 4567',
      'Lycée de Lubumbashi',
      'Demande de fonctionnalité',
      'Serait-il possible d''ajouter une fonctionnalité de gestion des examens dans le système?',
      'feature_request',
      'normal',
      'in_progress',
      'contact_form',
      NOW() - INTERVAL '3 days'
    ) ON CONFLICT DO NOTHING;
    
    -- Insert sample admin settings
    INSERT INTO public.contact_center_settings (
      admin_id,
      auto_assign_enabled,
      email_notifications,
      default_response_template,
      signature
    ) VALUES (
      admin_user_id,
      false,
      true,
      'Bonjour {sender_name},\n\nMerci pour votre message. Nous avons bien reçu votre demande concernant "{subject}".\n\nNous vous répondrons dans les plus brefs délais.\n\nCordialement,',
      'L''équipe SchoolConnect\nsupport@schoolconnect.cd\n+243 81 000 0000'
    ) ON CONFLICT (admin_id) DO NOTHING;
    
    RAISE NOTICE 'Sample contact center data inserted successfully';
  ELSE
    RAISE NOTICE 'No platform admin found, skipping sample data insertion';
  END IF;
END $$;
