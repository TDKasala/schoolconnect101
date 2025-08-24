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
   * Get all users (Admin API for platform admins)
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
          preferences: user.preferences ?? {}
        }))
      }

      // If RLS blocks access, use Admin API to get auth users and match with profiles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) throw authError

      // Get user profiles for each auth user
      const userProfiles: User[] = []
      
      for (const authUser of authUsers.users) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select(`
            *,
            school:schools(id, name, code)
          `)
          .eq('id', authUser.id)
          .single()

        if (!profileError && profile) {
          userProfiles.push(profile)
        } else {
          // Create a minimal profile from auth data if profile doesn't exist
          const minimalProfile: User = {
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
            updated_at: authUser.updated_at || authUser.created_at
          }
          userProfiles.push(minimalProfile)
        }
      }

      return userProfiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    }
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
