import { supabase } from '../lib/supabase'
import type { School, SubscriptionType } from '../types'

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
  static async create(schoolData: {
    name: string
    address: string
    city: string
    province: string
    phone: string
    email: string
    subscription_type?: SubscriptionType
    max_students?: number
  }): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .insert([{
        ...schoolData,
        country: 'RDC',
        subscription_type: schoolData.subscription_type || 'flex',
        max_students: schoolData.max_students || 100
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating school:', error)
      return null
    }

    return data
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
