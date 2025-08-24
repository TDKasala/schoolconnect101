import { supabase } from '../lib/supabase'
import type { ActivityLog } from '../types'

export class ActivityLogService {
  /**
   * Log an activity to the database
   */
  static async logActivity(
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Error logging activity:', error)
      }
    } catch (error) {
      console.error('Error in logActivity:', error)
    }
  }

  /**
   * Get activity logs with pagination
   */
  static async getActivityLogs(
    limit: number = 50,
    offset: number = 0
  ): Promise<ActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching activity logs:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getActivityLogs:', error)
      return []
    }
  }

  /**
   * Get activity logs for a specific resource
   */
  static async getResourceLogs(
    resourceType: string,
    resourceId: string,
    limit: number = 20
  ): Promise<ActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching resource logs:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getResourceLogs:', error)
      return []
    }
  }
}
