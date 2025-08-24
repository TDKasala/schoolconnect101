import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Comprehensive CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('FRONTEND_URL') || 'https://schoolconnect101.vercel.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
}

interface ApiResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  school_id?: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  approved: boolean
  user_status_id?: string
  last_login?: string
  preferences: object
  created_at: string
  updated_at: string
  school?: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders, 
      status: 200 
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    const response: ApiResponse = {
      success: false,
      message: 'Method not allowed',
      error: 'Only POST requests are supported'
    }
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    })
  }

  try {
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing required environment variables')
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verify authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required',
        error: 'Missing or invalid authorization header'
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify the requesting user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid authentication token',
        error: userError?.message || 'User not found'
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      })
    }

    // Check if user is platform admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('role, full_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile lookup error:', profileError)
      const response: ApiResponse = {
        success: false,
        message: 'Failed to verify user permissions',
        error: profileError.message
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403
      })
    }

    if (profile?.role !== 'platform_admin') {
      const response: ApiResponse = {
        success: false,
        message: 'Insufficient permissions',
        error: 'Only platform administrators can list users'
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403
      })
    }

    // Get all users using admin API with pagination support
    let allUsers: any[] = []
    let page = 1
    const perPage = 1000 // Supabase max per page
    
    while (true) {
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage
      })
      
      if (authError) {
        console.error('Auth users listing error:', authError)
        const response: ApiResponse = {
          success: false,
          message: 'Failed to fetch authentication users',
          error: authError.message
        }
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      if (!authUsers.users || authUsers.users.length === 0) {
        break
      }
      
      allUsers = allUsers.concat(authUsers.users)
      
      // If we got less than perPage results, we're done
      if (authUsers.users.length < perPage) {
        break
      }
      
      page++
    }

    // Get all user profiles from database
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        school:schools(id, name)
      `)

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError)
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch user profiles',
        error: profilesError.message
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Merge auth users with profiles
    const users: UserProfile[] = allUsers.map(authUser => {
      const profile = profiles?.find(p => p.id === authUser.id)
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
        role: profile?.role || authUser.user_metadata?.role || 'parent',
        school_id: profile?.school_id || null,
        phone: profile?.phone || null,
        avatar_url: profile?.avatar_url || null,
        is_active: profile?.is_active ?? true,
        approved: profile?.approved ?? false,
        user_status_id: profile?.user_status_id || null,
        last_login: authUser.last_sign_in_at || null,
        preferences: profile?.preferences || {},
        created_at: authUser.created_at,
        updated_at: profile?.updated_at || authUser.updated_at,
        school: profile?.school || null
      }
    })

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Success response
    const response: ApiResponse = {
      success: true,
      message: `Retrieved ${users.length} users successfully`,
      data: {
        users,
        total: users.length,
        timestamp: new Date().toISOString()
      }
    }

    console.log(`Listed ${users.length} users for admin: ${profile.full_name}`)
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Unexpected error in admin-list-users:', error)
    
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
