import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Comprehensive CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
}

interface CreateUserRequest {
  email: string
  password: string
  full_name: string
  role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent'
  school_id?: string
  approved?: boolean
}

interface ApiResponse {
  success: boolean
  message: string
  data?: any
  error?: string
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
        error: 'Only platform administrators can create users'
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403
      })
    }

    // Parse and validate request body
    let requestData: CreateUserRequest
    try {
      requestData = await req.json()
    } catch (parseError) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid JSON payload',
        error: 'Request body must be valid JSON'
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    const { email, password, full_name, role, school_id, approved = true } = requestData

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      const response: ApiResponse = {
        success: false,
        message: 'Missing required fields',
        error: 'email, password, full_name, and role are required'
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Validate role
    const validRoles = ['platform_admin', 'school_admin', 'teacher', 'parent']
    if (!validRoles.includes(role)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid role specified',
        error: `Role must be one of: ${validRoles.join(', ')}`
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Create user using admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role
      }
    })

    if (authError) {
      console.error('Auth user creation error:', authError)
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create authentication user',
        error: authError.message
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    if (!authData.user) {
      const response: ApiResponse = {
        success: false,
        message: 'User creation failed',
        error: 'No user data returned from authentication service'
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Create user profile in database
    const { data: profileData, error: profileInsertError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        full_name,
        role,
        school_id: school_id || null,
        approved,
        is_active: true,
        phone: null,
        avatar_url: null,
        user_status_id: null,
        last_login: null,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (profileInsertError) {
      console.error('Profile creation error:', profileInsertError)
      
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create user profile',
        error: profileInsertError.message
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Success response
    const response: ApiResponse = {
      success: true,
      message: `User ${full_name} created successfully`,
      data: {
        user: profileData,
        auth_id: authData.user.id
      }
    }

    console.log(`User created successfully: ${email} (${role})`)
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Unexpected error in admin-create-user:', error)
    
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
