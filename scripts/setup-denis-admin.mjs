#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://agmatjypwmmzgxutlgxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbWF0anlwd21temd4dXRsZ3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDQ4NzMsImV4cCI6MjA3MTUyMDg3M30.6m9iFo5H4I5e5bv0uGl3_DqT_CyS7MfALuWtVjxBcTI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDenisAdmin() {
  console.log('🚀 Setting up Denis as platform admin...');
  
  const adminCredentials = {
    email: 'deniskasala17@gmail.com',
    password: '@Raysunkasala2016',
    fullName: 'Denis Kasala'
  };

  try {
    // Step 1: Sign up the user
    console.log('📝 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminCredentials.email,
      password: adminCredentials.password,
      options: {
        data: {
          full_name: adminCredentials.fullName
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists, proceeding to update profile...');
        
        // Try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminCredentials.email,
          password: adminCredentials.password
        });
        
        if (signInError) {
          console.error('❌ Error signing in:', signInError.message);
          return;
        }
        
        if (signInData.user) {
          await updateUserProfile(signInData.user.id, adminCredentials);
        }
      } else {
        console.error('❌ Error creating auth user:', authError.message);
        return;
      }
    } else if (authData.user) {
      console.log('✅ Auth user created successfully');
      await updateUserProfile(authData.user.id, adminCredentials);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function updateUserProfile(userId, credentials) {
  console.log('👤 Creating/updating user profile...');
  
  try {
    // Try to insert first
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: credentials.email,
        full_name: credentials.fullName,
        role: 'platform_admin',
        school_id: null,
        is_active: true,
        approved: true
      });

    if (insertError) {
      // If insert fails, try update
      console.log('🔄 Profile exists, updating...');
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: credentials.fullName,
          role: 'platform_admin',
          school_id: null,
          is_active: true,
          approved: true
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error updating profile:', updateError.message);
        return;
      }
      console.log('✅ User profile updated successfully');
    } else {
      console.log('✅ User profile created successfully');
    }

    console.log('\n🎉 Denis platform admin setup complete!');
    console.log('📧 Email:', credentials.email);
    console.log('👤 Name:', credentials.fullName);
    console.log('🛡️  Role: platform_admin');
    console.log('✅ Status: Active & Approved');
    
  } catch (error) {
    console.error('❌ Error updating profile:', error);
  }
}

// Run the setup
setupDenisAdmin().catch(console.error);
