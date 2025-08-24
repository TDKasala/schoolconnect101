import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the requesting user is a platform admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is platform admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'platform_admin') {
      throw new Error('Insufficient permissions')
    }

    // Get all auth users using admin API
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) throw authError

    // Get user profiles for each auth user
    const userProfiles = []
    
    for (const authUser of authUsers.users) {
      const { data: userProfile, error: profileFetchError } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          school:schools(id, name, registration_number)
        `)
        .eq('id', authUser.id)
        .single()

      if (!profileFetchError && userProfile) {
        userProfiles.push(userProfile)
      } else {
        // Create a minimal profile from auth data if profile doesn't exist
        const minimalProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email || '',
          role: authUser.user_metadata?.role || 'teacher',
          school_id: null,
          phone: null,
          avatar_url: null,
          is_active: true,
          approved: false,
          user_status_id: null,
          last_login: authUser.last_sign_in_at,
          preferences: {},
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || authUser.created_at,
          school: null
        }
        userProfiles.push(minimalProfile)
      }
    }

    // Sort by creation date (newest first)
    userProfiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return new Response(
      JSON.stringify({ success: true, users: userProfiles }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error listing users:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
