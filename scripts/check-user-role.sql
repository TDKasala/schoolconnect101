-- Check current user role and status
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as auth_role,
  p.role as profile_role,
  p.approved,
  p.full_name,
  p.created_at
FROM auth.users u
LEFT JOIN public.users p ON u.id = p.id
WHERE u.email = 'denis.mukeba@gmail.com';
