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

    // Ensure all required fields are present
    return data ? {
      ...data,
      is_active: data.is_active ?? true,
      phone: data.phone ?? null,
      avatar_url: data.avatar_url ?? null,
      user_status_id: data.user_status_id ?? null,
      last_login: data.last_login ?? null,
      preferences: data.preferences ?? {}
    } : null
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

    return (data || []).map(user => ({
      ...user,
      is_active: user.is_active ?? true,
      phone: user.phone ?? null,
      avatar_url: user.avatar_url ?? null,
      user_status_id: user.user_status_id ?? null,
      last_login: user.last_login ?? null,
      preferences: user.preferences ?? {}
    }))
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

    return (data || []).map(user => ({
      ...user,
      is_active: user.is_active ?? true,
      phone: user.phone ?? null,
      avatar_url: user.avatar_url ?? null,
      user_status_id: user.user_status_id ?? null,
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

    return (data || []).map(user => ({
      ...user,
      is_active: user.is_active ?? true,
      phone: user.phone ?? null,
      avatar_url: user.avatar_url ?? null,
      user_status_id: user.user_status_id ?? null,
      last_login: user.last_login ?? null,
      preferences: user.preferences ?? {}
    }))
  }

  /**
   * Get all users (using Edge Function for platform admins)
   */
  static async getAll(): Promise<User[]> {
    try {
      // First try to get from users table (if RLS allows)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          school:schools(id, name, code)
        `)
        .order('created_at', { ascending: false })

      if (!usersError && usersData && usersData.length > 0) {
        // Ensure all required fields are present
        return usersData.map(user => ({
          ...user,
          is_active: user.is_active ?? true,
          phone: user.phone ?? null,
          avatar_url: user.avatar_url ?? null,
          user_status_id: user.user_status_id ?? null,
          last_login: user.last_login ?? null,
          preferences: user.preferences ?? {},
          school: user.school ? {
            ...user.school,
            code: user.school.code || user.school.registration_number || 'N/A'
          } : null
        }))
      }

      // If RLS blocks access, use Edge Function to get all users
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) {
        throw new Error('No authentication session')
      }

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/admin-list-users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`Edge function error: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users')
      }

      // Ensure all required fields are present and add code field to school
      return result.users.map((user: any) => ({
        ...user,
        is_active: user.is_active ?? true,
        phone: user.phone ?? null,
        avatar_url: user.avatar_url ?? null,
        user_status_id: user.user_status_id ?? null,
        last_login: user.last_login ?? null,
        preferences: user.preferences ?? {},
        school: user.school ? {
          ...user.school,
          code: user.school.code || user.school.registration_number || 'N/A'
        } : null
      }))

    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    }
  }

  /**
   * Create a new user using Edge Function (does not log them in)
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Get current session for authentication
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) {
        throw new Error('No authentication session')
      }

      // Call Edge Function to create user
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/admin-create-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          full_name: userData.full_name,
          role: userData.role,
          school_id: userData.school_id,
          approved: userData.approved ?? true
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Edge function error: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user')
      }

      // Ensure all required fields are present
      return {
        ...result.user,
        is_active: result.user.is_active ?? true,
        phone: result.user.phone ?? null,
        avatar_url: result.user.avatar_url ?? null,
        user_status_id: result.user.user_status_id ?? null,
        last_login: result.user.last_login ?? null,
        preferences: result.user.preferences ?? {}
      }
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }
}
