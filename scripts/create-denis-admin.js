// Script to create Denis as platform admin
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://agmatjypwmmzgxutlgxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbWF0anlwd21temd4dXRsZ3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDQ4NzMsImV4cCI6MjA3MTUyMDg3M30.6m9iFo5H4I5e5bv0uGl3_DqT_CyS7MfALuWtVjxBcTI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const adminUser = {
  email: 'deniskasala17@gmail.com',
  password: '@Raysunkasala2016',
  fullName: 'Denis Kasala'
};

async function createDenisAdmin() {
  console.log('Creating Denis as platform admin...');
  
  try {
    // Sign up the user
    console.log('Signing up user...');
    const { data, error } = await supabase.auth.signUp({
      email: adminUser.email,
      password: adminUser.password
    });
    
    if (error) {
      console.error('Error signing up:', error.message);
      return;
    }
    
    console.log('User signed up successfully. User ID:', data.user?.id);
    
    if (data.user?.id) {
      // Create user profile with platform_admin role
      console.log('Creating user profile...');
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: adminUser.email,
          full_name: adminUser.fullName,
          role: 'platform_admin',
          school_id: null,
          is_active: true,
          approved: true
        });
        
      if (insertError) {
        console.log('Insert failed, trying update...');
        // If insert fails, try update
        const { error: updateError } = await supabase
          .from('users')
          .update({
            full_name: adminUser.fullName,
            role: 'platform_admin',
            school_id: null,
            is_active: true,
            approved: true
          })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error('Error updating user profile:', updateError.message);
          return;
        }
        
        console.log('User profile updated successfully');
      } else {
        console.log('User profile created successfully');
      }
    }
    
    console.log('\n✅ Denis platform admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminUser.password);
    console.log('👤 Full Name:', adminUser.fullName);
    console.log('🛡️ Role: platform_admin');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the function
createDenisAdmin();
