import { useAuth as useAuthContext } from '../contexts/AuthContext'

// Re-export the main auth hook
export const useAuth = useAuthContext

// Additional convenience hooks
export function useUser() {
  const { user, profile } = useAuthContext()
  return { user, profile }
}

export function useAuthState() {
  const { user, profile, session, loading, error } = useAuthContext()
  return {
    isAuthenticated: !!user,
    isApproved: profile?.approved || false,
    isLoading: loading,
    hasError: !!error,
    user,
    profile,
    session,
    error
  }
}

export function usePermissions() {
  const { profile } = useAuthContext()
  
  const hasRole = (role: string) => profile?.role === role
  
  const isPlatformAdmin = () => hasRole('platform_admin')
  const isSchoolAdmin = () => hasRole('school_admin')
  const isTeacher = () => hasRole('teacher')
  const isParent = () => hasRole('parent')
  
  const canAccessSchool = (schoolId?: string) => {
    if (!profile) return false
    if (isPlatformAdmin()) return true
    return profile.school_id === schoolId
  }
  
  const canManageUsers = () => {
    return isPlatformAdmin() || isSchoolAdmin()
  }
  
  const canApproveUsers = () => {
    return isPlatformAdmin()
  }
  
  return {
    hasRole,
    isPlatformAdmin,
    isSchoolAdmin,
    isTeacher,
    isParent,
    canAccessSchool,
    canManageUsers,
    canApproveUsers,
    role: profile?.role
  }
}
