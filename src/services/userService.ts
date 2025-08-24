import { supabase } from '../lib/supabase'
import type { User, UserRole } from '../types'

interface CreateUserData {
  email: string
  password: string
  full_name: string
  role: UserRole
  school_id?: string
  approved?: boolean
}

export class UserService {
  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  /**
   * Get users by school ID
   */
  static async getBySchoolId(schoolId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('school_id', schoolId)
      .eq('is_active', true)
      .order('full_name')

    if (error) {
      console.error('Error fetching users by school:', error)
      return []
    }

    return data || []
  }

  /**
   * Get users by role
   */
  static async getByRole(role: UserRole, schoolId?: string): Promise<User[]> {
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_active', true)

    if (schoolId) {
      query = query.eq('school_id', schoolId)
    }

    const { data, error } = await query.order('full_name')

    if (error) {
      console.error('Error fetching users by role:', error)
      return []
    }

    return data || []
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
   * Get pending users (not approved)
   */
  static async getPendingUsers(schoolId?: string): Promise<User[]> {
    let query = supabase
      .from('users')
      .select('*')
      .eq('approved', false)
      .eq('is_active', true)

    if (schoolId) {
      query = query.eq('school_id', schoolId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pending users:', error)
      return []
    }

    return data || []
  }

  /**
   * Create a new user using Admin API (does not log them in)
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Create user in auth using Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Skip email confirmation for admin-created users
        user_metadata: {
          full_name: userData.full_name,
          role: userData.role
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          school_id: userData.school_id || null,
          approved: userData.approved ?? true,
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

      if (profileError) throw profileError
      if (!profileData) throw new Error('Failed to create user profile')

      return profileData
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }
}
