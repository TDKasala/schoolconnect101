import { supabase } from '../lib/supabase'
import type { School, CreateSchoolData, SchoolAdminAssignment, User } from '../types'
import { UserService } from './userService'

export class SchoolService {
  /**
   * Get school by ID
   */
  static async getById(id: string): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching school:', error)
      return null
    }

    return data
  }

  /**
   * Get all active schools
   */
  static async getAll(): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching schools:', error)
      return []
    }

    return data || []
  }

  /**
   * Create a new school
   */
  static async create(schoolData: CreateSchoolData): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .insert([schoolData])
      .select()
      .single()

    if (error) {
      console.error('Error creating school:', error)
      throw error
    }

    return data
  }

  /**
   * Create school with admin assignment
   */
  static async createWithAdmin(
    schoolData: CreateSchoolData,
    adminAssignment: SchoolAdminAssignment
  ): Promise<{ school: School; admin: User }> {
    // Start a transaction-like operation
    try {
      // 1. Create the school
      const school = await this.create(schoolData)
      if (!school) throw new Error('Failed to create school')

      let admin: User

      if (adminAssignment.type === 'existing') {
        // 2a. Update existing user to be school admin
        if (!adminAssignment.existingUserId) {
          throw new Error('Existing user ID is required')
        }

        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            role: 'school_admin',
            school_id: school.id
          })
          .eq('id', adminAssignment.existingUserId)
          .select()
          .single()

        if (updateError) throw updateError
        admin = updatedUser

      } else {
        // 2b. Create new user as school admin
        if (!adminAssignment.newUserData) {
          throw new Error('New user data is required')
        }

        // Create new user using Edge Function (does not log them in)
        admin = await UserService.createUser({
          email: adminAssignment.newUserData.email,
          password: 'TempPass123!', // Temporary password - user should reset
          full_name: adminAssignment.newUserData.full_name,
          role: 'school_admin',
          school_id: school.id,
          approved: true
        })
      }

      return { school, admin }

    } catch (error) {
      console.error('Error creating school with admin:', error)
      throw error
    }
  }

  /**
   * Update school
   */
  static async update(id: string, updates: Partial<School>): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating school:', error)
      return null
    }

    return data
  }

  /**
   * Get school statistics
   */
  static async getStats(schoolId: string) {
    const [studentsResult, teachersResult, classesResult] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('school_id', schoolId).eq('role', 'teacher'),
      supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', schoolId)
    ])

    return {
      totalStudents: studentsResult.count || 0,
      totalTeachers: teachersResult.count || 0,
      totalClasses: classesResult.count || 0
    }
  }
}
