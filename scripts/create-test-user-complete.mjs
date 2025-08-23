import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://agmatjypwmmzgxutlgxa.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbWF0anlwd21temd4dXRsZ3hhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0NDg3MywiZXhwIjoyMDcxNTIwODczfQ.Zt8qJYQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ'; // You'll need the service role key

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Create user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@schoolconnect.com',
      password: 'TestPassword123!',
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created:', authData.user.id);

    // Create user profile in public.users
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'test@schoolconnect.com',
        full_name: 'Test Admin User',
        role: 'platform_admin',
        school_id: null,
        approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      return;
    }

    console.log('User profile created successfully:', profileData);
    console.log('\nTest user credentials:');
    console.log('Email: test@schoolconnect.com');
    console.log('Password: TestPassword123!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUser();
