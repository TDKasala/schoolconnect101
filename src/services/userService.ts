import { supabase } from '../lib/supabase'
import type { User, UserRole } from '../types'

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
}
