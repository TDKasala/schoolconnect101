import { supabase } from '../lib/supabase';

export const sessionDebug = {
  logSessionInfo: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.group('🔍 Session Debug Info');
      console.log('Session exists:', !!session);
      console.log('Session error:', error);
      
      if (session) {
        console.log('User ID:', session.user.id);
        console.log('User email:', session.user.email);
        console.log('Access token expires at:', new Date(session.expires_at! * 1000));
        console.log('Refresh token exists:', !!session.refresh_token);
        console.log('Time until expiry (minutes):', Math.round((session.expires_at! * 1000 - Date.now()) / 60000));
      }
      
      // Check localStorage
      const storedSession = localStorage.getItem('schoolconnect-auth');
      console.log('LocalStorage session exists:', !!storedSession);
      
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          console.log('Stored session valid:', !!parsed.access_token);
        } catch (e) {
          console.log('Stored session parse error:', e);
        }
      }
      
      console.groupEnd();
      
      return { session, error };
    } catch (err) {
      console.error('Session debug error:', err);
      return { session: null, error: err };
    }
  },

  refreshSession: async () => {
    try {
      console.log('🔄 Attempting to refresh session...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh failed:', error);
        return { success: false, error };
      }
      
      console.log('✅ Session refreshed successfully');
      return { success: true, session: data.session };
    } catch (err) {
      console.error('Session refresh exception:', err);
      return { success: false, error: err };
    }
  },

  clearSession: async () => {
    try {
      console.log('🧹 Clearing session...');
      await supabase.auth.signOut();
      localStorage.removeItem('schoolconnect-auth');
      console.log('✅ Session cleared');
    } catch (err) {
      console.error('Session clear error:', err);
    }
  }
};

// Add global debug functions in development
if (process.env.NODE_ENV === 'development') {
  (window as any).sessionDebug = sessionDebug;
}
