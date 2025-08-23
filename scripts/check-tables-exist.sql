-- Check which tables already exist to avoid conflicts
SELECT 
  schemaname,
  tablename,
  'EXISTS' as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'platform_messages',
  'message_recipients', 
  'platform_announcements',
  'announcement_views',
  'communication_logs',
  'audit_logs',
  'security_alerts',
  'audit_log_archive',
  'notifications',
  'user_notifications',
  'system_alerts'
)
ORDER BY tablename;
