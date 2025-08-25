import { supabase } from '../lib/supabase'
import type { User, UserRole } from '../types'

export interface CreateUserData {
  email: string
  password: string
  full_name: string
  role: UserRole
  school_id?: string
  approved?: boolean
}

export class UserAuthService {
  /**
   * Get all users with profile information and school details
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      // Fetch user profiles with school information
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          school:schools(id, name, code)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching users:', error)
        return []
      }
      
      return data.map(user => ({
        ...user,
        phone: user.phone ?? null,
        avatar_url: user.avatar_url ?? null,
        last_login: user.last_login ?? null,
        preferences: user.preferences ?? {},
        school: user.school ? {
          ...user.school,
          code: user.school.code || user.school.registration_number || 'N/A'
        } : null
      }))
    } catch (error) {
      console.error('Error in getAllUsers:', error)
      return []
    }
  }

  /**
   * Create a new user directly with Supabase Admin API
   * This method preserves the current admin session
   */
  static async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      // Store current session to restore if needed
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      // 1. Create auth user with email/password using admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { 
          full_name: userData.full_name, 
          role: userData.role 
        }
      })

      if (authError) {
        console.error('Auth user creation failed:', authError)
        throw new Error(authError.message)
      }
      
      if (!authData.user) {
        throw new Error('Auth user creation returned no user')
      }

      // 2. Create profile record in users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          school_id: userData.school_id || null,
          approved: userData.approved ?? true,
          is_active: true
        }])
        .select('*, school:schools(id, name, code)')
        .single()

      if (profileError) {
        console.error('Profile creation failed:', profileError)
        
        // Try to clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error(profileError.message)
      }

      // 3. Ensure admin session is preserved
      if (currentSession && currentSession.user) {
        const { data: { session: newSession } } = await supabase.auth.getSession()
        
        // If session changed unexpectedly, restore the admin session
        if (!newSession || newSession.user.id !== currentSession.user.id) {
          console.log('UserAuthService: Restoring admin session after user creation')
          await supabase.auth.setSession({
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token
          })
        }
      }

      return {
        ...profileData,
        avatar_url: null,
        phone: null,
        user_status_id: null,
        last_login: null,
        preferences: {}
      }
    } catch (error) {
      console.error('Error in createUser:', error)
      throw error
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*, school:schools(id, name, code)')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return {
      ...data,
      phone: data.phone ?? null,
      avatar_url: data.avatar_url ?? null,
      last_login: data.last_login ?? null,
      preferences: data.preferences ?? {},
      school: data.school ? {
        ...data.school,
        code: data.school.code || data.school.registration_number || 'N/A'
      } : null
    }
  }

  /**
   * Get users by school ID
   */
  static async getUsersBySchool(schoolId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('school_id', schoolId)
      .eq('approved', true)
      .order('full_name')

    if (error) {
      console.error('Error fetching users by school:', error)
      return []
    }

    return data.map(user => ({
      ...user,
      phone: user.phone ?? null,
      avatar_url: user.avatar_url ?? null,
      last_login: user.last_login ?? null,
      preferences: user.preferences ?? {}
    }))
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: UserRole, schoolId?: string): Promise<User[]> {
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('approved', true)

    if (schoolId) {
      query = query.eq('school_id', schoolId)
    }

    const { data, error } = await query.order('full_name')

    if (error) {
      console.error('Error fetching users by role:', error)
      return []
    }

    return data.map(user => ({
      ...user,
      phone: user.phone ?? null,
      avatar_url: user.avatar_url ?? null,
      last_login: user.last_login ?? null,
      preferences: user.preferences ?? {}
    }))
  }

  /**
   * Update user approval status
   */
  static async updateApprovalStatus(id: string, approved: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ approved })
      .eq('id', id)

    if (error) {
      console.error('Error updating user approval:', error)
      return false
    }

    return true
  }

  /**

    return true
  }
}
