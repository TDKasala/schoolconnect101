import { supabase } from '../lib/supabase'
import type { User } from '../types'

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Sign up new user
   */
  static async signUp(email: string, password: string, userData: {
    full_name: string
    role: string
    school_id?: string
    phone?: string
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Get current user session
   */
  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new Error(error.message)
    }

    return session
  }

  /**
   * Get current user profile
   */
  static async getCurrentUserProfile(): Promise<User | null> {
    const session = await this.getSession()
    
    if (!session?.user) {
      return null
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    
    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Update password
   */
  static async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    })
    
    if (error) {
      throw new Error(error.message)
    }
  }
}
