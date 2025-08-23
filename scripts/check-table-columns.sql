-- Check the actual column names in the tables to fix policy references
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN (
  'message_recipients',
  'announcement_views',
  'platform_messages',
  'platform_announcements',
  'audit_logs',
  'security_alerts'
)
ORDER BY table_name, ordinal_position;
