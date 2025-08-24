import { supabase } from '../lib/supabase'
import type { School, CreateSchoolData, SchoolAdminAssignment } from '../types'
import { UserAuthService } from './userAuthService'

export class SchoolDbService {
  /**
   * Get all active schools
   */
  static async getAllSchools(): Promise<School[]> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          admin:users(id, full_name, email)
        `)
        .eq('is_active', true)
        .order('name')
      
      if (error) {
        console.error('Error fetching schools:', error)
        return []
      }
      
      return data.map(school => ({
        ...school,
        // Find the school admin in the nested users
        admin: Array.isArray(school.admin) && school.admin.length > 0 
          ? school.admin.find(user => user.id === school.admin_id) || null
          : null
      }))
    } catch (error) {
      console.error('Error in getAllSchools:', error)
      return []
    }
  }
  
  /**
   * Get school by ID
   */
  static async getSchoolById(id: string): Promise<School | null> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          admin:users(id, full_name, email)
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching school:', error)
        return null
      }
      
      return {
        ...data,
        // Find the school admin in the nested users
        admin: Array.isArray(data.admin) && data.admin.length > 0 
          ? data.admin.find(user => user.id === data.admin_id) || null
          : null
      }
    } catch (error) {
      console.error('Error in getSchoolById:', error)
      return null
    }
  }
  
  /**
   * Create a new school
   */
  static async createSchool(schoolData: CreateSchoolData): Promise<School | null> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert([{
          name: schoolData.name,
          address: schoolData.address || null,
          city: schoolData.city || null,
          province: schoolData.province || null,
          country: schoolData.country || 'République Démocratique du Congo',
          phone: schoolData.phone || null,
          email: schoolData.email || null,
          max_students: schoolData.max_students || null,
          is_active: true
        }])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating school:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error in createSchool:', error)
      throw error
    }
  }
  
  /**
   * Create school with admin assignment
   */
  static async createSchoolWithAdmin(
    schoolData: CreateSchoolData,
    adminAssignment: SchoolAdminAssignment
  ): Promise<{ school: School; admin: any }> {
    try {
      // Use Supabase transaction when available
      // For now, implement with sequential operations
      
      // 1. Create the school
      const school = await this.createSchool(schoolData)
      if (!school) throw new Error('Failed to create school')
      
      let admin
      
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
        
        if (updateError) {
          // Roll back - delete school if user update fails
          await supabase.from('schools').delete().eq('id', school.id)
          throw updateError
        }
        
        admin = updatedUser
        
        // Update the school with admin_id reference
        await supabase
          .from('schools')
          .update({ admin_id: admin.id })
          .eq('id', school.id)
          
      } else {
        // 2b. Create new user as school admin
        if (!adminAssignment.newUserData) {
          throw new Error('New user data is required')
        }
        
        // Generate a temporary password (in real-world app, send this via email)
        const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!'
        
        // Create new admin user
        admin = await UserAuthService.createUser({
          email: adminAssignment.newUserData.email,
          password: tempPassword, // Temporary password
          full_name: adminAssignment.newUserData.full_name,
          role: 'school_admin',
          school_id: school.id,
          approved: true
        })
        
        if (!admin) {
          // Roll back - delete school if admin creation fails
          await supabase.from('schools').delete().eq('id', school.id)
          throw new Error('Failed to create admin user')
        }
        
        // Update the school with admin_id reference
        await supabase
          .from('schools')
          .update({ admin_id: admin.id })
          .eq('id', school.id)
      }
      
      return { school, admin }
      
    } catch (error) {
      console.error('Error in createSchoolWithAdmin:', error)
      throw error
    }
  }
  
  /**
   * Update school
   */
  static async updateSchool(id: string, updates: Partial<School>): Promise<School | null> {
    try {
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
    } catch (error) {
      console.error('Error in updateSchool:', error)
      return null
    }
  }
  
  /**
   * Delete school (set inactive rather than permanently delete)
   */
  static async deleteSchool(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ is_active: false })
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting school:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error in deleteSchool:', error)
      return false
    }
  }
  
  /**
   * Get school statistics
   */
  static async getSchoolStats(schoolId: string) {
    try {
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
    } catch (error) {
      console.error('Error in getSchoolStats:', error)
      return {
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0
      }
    }
  }
}
